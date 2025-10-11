"use server";

import { authActionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

const getStatsSchema = z.object({
  propertyId: z.string().cuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const getReviewStats = authActionClient
  .metadata({ actionName: "getReviewStats" })
  .inputSchema(getStatsSchema)
  .action(async ({ parsedInput }) => {
    const { propertyId, startDate, endDate } = parsedInput;

    // Build where clause
    const where: any = {};
    if (propertyId) where.propertyId = propertyId;
    if (startDate || endDate) {
      where.submittedAt = {};
      if (startDate) where.submittedAt.gte = startDate;
      if (endDate) where.submittedAt.lte = endDate;
    }

    // Get total counts
    const [
      totalReviews,
      approvedReviews,
      pendingReviews,
      featuredReviews,
    ] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.count({ where: { ...where, approved: true } }),
      prisma.review.count({ where: { ...where, approved: false } }),
      prisma.review.count({ where: { ...where, featured: true } }),
    ]);

    // Get average ratings
    const avgRatings = await prisma.review.aggregate({
      where: { ...where, rating: { not: null } },
      _avg: {
        rating: true,
        cleanliness: true,
        communication: true,
        accuracy: true,
        location: true,
        checkin: true,
        value: true,
        respectRules: true,
      },
    });

    // Get reviews by source
    const reviewsBySource = await prisma.review.groupBy({
      by: ["source"],
      where,
      _count: true,
    });

    // Get reviews by channel
    const reviewsByChannel = await prisma.review.groupBy({
      by: ["channel"],
      where: { ...where, channel: { not: null } },
      _count: true,
    });

    // Get rating distribution
    let ratingDistribution;

    if (propertyId) {
      ratingDistribution = await prisma.$queryRaw<
        Array<{ rating_range: string; count: bigint }>
      >`
        SELECT
          CASE
            WHEN rating >= 9 THEN '9-10'
            WHEN rating >= 7 THEN '7-8'
            WHEN rating >= 5 THEN '5-6'
            ELSE '0-4'
          END as rating_range,
          COUNT(*) as count
        FROM "Review"
        WHERE rating IS NOT NULL AND "propertyId" = ${propertyId}
        GROUP BY rating_range
        ORDER BY rating_range DESC
      `;
    } else {
      ratingDistribution = await prisma.$queryRaw<
        Array<{ rating_range: string; count: bigint }>
      >`
        SELECT
          CASE
            WHEN rating >= 9 THEN '9-10'
            WHEN rating >= 7 THEN '7-8'
            WHEN rating >= 5 THEN '5-6'
            ELSE '0-4'
          END as rating_range,
          COUNT(*) as count
        FROM "Review"
        WHERE rating IS NOT NULL
        GROUP BY rating_range
        ORDER BY rating_range DESC
      `;
    }

    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      featuredReviews,
      averageRating: avgRatings._avg.rating || 0,
      categoryAverages: {
        cleanliness: avgRatings._avg.cleanliness || 0,
        communication: avgRatings._avg.communication || 0,
        accuracy: avgRatings._avg.accuracy || 0,
        location: avgRatings._avg.location || 0,
        checkin: avgRatings._avg.checkin || 0,
        value: avgRatings._avg.value || 0,
        respectRules: avgRatings._avg.respectRules || 0,
      },
      bySource: reviewsBySource.map((item) => ({
        source: item.source,
        count: item._count,
      })),
      byChannel: reviewsByChannel.map((item) => ({
        channel: item.channel || "unknown",
        count: item._count,
      })),
      ratingDistribution: ratingDistribution.map((item) => ({
        range: item.rating_range,
        count: Number(item.count),
      })),
    };
  });


"use server";

import { authActionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db/client";
import { getReviewsFiltersSchema } from "@/lib/schemas/review";

export const getReviews = authActionClient
  .metadata({ actionName: "getReviews" })
  .inputSchema(getReviewsFiltersSchema)
  .action(async ({ parsedInput }) => {
    const {
      propertyId,
      source,
      channel,
      approved,
      featured,
      minRating,
      maxRating,
      startDate,
      endDate,
      search,
      sortBy,
      sortOrder,
      page,
      limit,
    } = parsedInput;

    // Build where clause
    const where: any = {};

    if (propertyId) where.propertyId = propertyId;
    if (source) where.source = source;
    if (channel) where.channel = channel;
    if (approved !== undefined) where.approved = approved;
    if (featured !== undefined) where.featured = featured;

    if (minRating !== undefined || maxRating !== undefined) {
      where.rating = {};
      if (minRating !== undefined) where.rating.gte = minRating;
      if (maxRating !== undefined) where.rating.lte = maxRating;
    }

    if (startDate || endDate) {
      where.submittedAt = {};
      if (startDate) where.submittedAt.gte = startDate;
      if (endDate) where.submittedAt.lte = endDate;
    }

    if (search) {
      where.OR = [
        { guestName: { contains: search, mode: "insensitive" } },
        { publicReview: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === "date") {
      orderBy.submittedAt = sortOrder;
    } else if (sortBy === "rating") {
      orderBy.rating = sortOrder;
    } else if (sortBy === "property") {
      orderBy.property = { name: sortOrder };
    }

    // Get total count
    const total = await prisma.review.count({ where });

    // Get paginated reviews
    const reviews = await prisma.review.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        property: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  });


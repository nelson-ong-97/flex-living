"use server";

import { actionClient, authActionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

// Public action to get all properties
export const getProperties = actionClient
  .metadata({ actionName: "getProperties" })
  .action(async () => {
    // Fetch all properties with review counts
    const properties = await prisma.property.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            reviews: {
              where: {
                approved: true,
              },
            },
          },
        },
      },
    });

    // Get average ratings for all properties in a single query using groupBy
    const avgRatings = await prisma.review.groupBy({
      by: ['propertyId'],
      where: {
        approved: true,
        rating: { not: null },
      },
      _avg: {
        rating: true,
      },
    });

    // Create a map for quick lookup
    const avgRatingsMap = new Map(
      avgRatings.map(item => [item.propertyId, item._avg.rating || 0])
    );

    // Combine properties with their average ratings
    const propertiesWithStats = properties.map(property => ({
      ...property,
      averageRating: avgRatingsMap.get(property.id) || 0,
      reviewCount: property._count.reviews,
    }));

    return {
      properties: propertiesWithStats,
    };
  });

// Get single property by slug (public)
const getPropertySchema = z.object({
  slug: z.string(),
});

export const getProperty = actionClient
  .metadata({ actionName: "getProperty" })
  .inputSchema(getPropertySchema)
  .action(async ({ parsedInput }) => {
    const { slug } = parsedInput;

    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            reviews: {
              where: {
                approved: true,
              },
            },
          },
        },
      },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: {
        propertyId: property.id,
        approved: true,
        rating: { not: null },
      },
      _avg: {
        rating: true,
      },
    });

    return {
      property: {
        ...property,
        averageRating: avgRating._avg.rating || 0,
        reviewCount: property._count.reviews,
      },
    };
  });

// Get public reviews for a property
const getPublicReviewsSchema = z.object({
  propertyId: z.string().cuid(),
  sortBy: z.enum(["recent", "rating", "featured"]).default("recent"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

export const getPublicReviews = actionClient
  .metadata({ actionName: "getPublicReviews" })
  .inputSchema(getPublicReviewsSchema)
  .action(async ({ parsedInput }) => {
    const { propertyId, sortBy, page, limit } = parsedInput;

    // Build orderBy
    let orderBy: any = {};
    if (sortBy === "recent") {
      orderBy = { submittedAt: "desc" };
    } else if (sortBy === "rating") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "featured") {
      orderBy = [{ featured: "desc" }, { rating: "desc" }];
    }

    // Get total count
    const total = await prisma.review.count({
      where: {
        propertyId,
        approved: true,
      },
    });

    // Get reviews
    const reviews = await prisma.review.findMany({
      where: {
        propertyId,
        approved: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
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


"use server";

import { authActionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db/client";
import { hostawayClient } from "@/lib/hostaway/client";
import { normalizeHostawayReviews } from "@/lib/hostaway/normalizer";
import { HostawayError } from "@/lib/hostaway/errors";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const syncReviewsSchema = z.object({
  propertyId: z.string().cuid(),
  listingId: z.number().int().optional(),
});

export const syncReviews = authActionClient
  .metadata({ actionName: "syncReviews" })
  .inputSchema(syncReviewsSchema)
  .action(async ({ parsedInput }) => {
    const { propertyId, listingId } = parsedInput;

    let newCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    let hostawayError: HostawayError | null = null;
    let usingMockData = false;

    // Try to fetch reviews from Hostaway API
    let hostawayReviews;
    try {
      hostawayReviews = await hostawayClient.getReviews({
        listingId,
      });
    } catch (error) {
      // Handle Hostaway errors
      if (error instanceof HostawayError) {
        hostawayError = error;

        // If error suggests using mock data, use it
        if (error.shouldUseMockData()) {
          console.warn(`Hostaway API error (${error.type}), using mock data:`, error.message);
          hostawayReviews = hostawayClient.getMockReviews({ listingId });
          usingMockData = true;
        } else {
          // For non-recoverable errors, throw with user-friendly message
          throw new Error(error.getUserMessage());
        }
      } else {
        // Unknown error, re-throw
        throw error;
      }
    }

    // Normalize reviews
    const normalizedReviews = normalizeHostawayReviews(
      hostawayReviews,
      propertyId
    );

      // Sync each review to database
      for (const reviewData of normalizedReviews) {
        try {
          const existing = await prisma.review.findUnique({
            where: {
              source_externalId: {
                source: reviewData.source,
                externalId: reviewData.externalId,
              },
            },
          });

          if (existing) {
            // Update existing review
            await prisma.review.update({
              where: { id: existing.id },
              data: {
                guestName: reviewData.guestName,
                rating: reviewData.rating,
                publicReview: reviewData.publicReview,
                cleanliness: reviewData.cleanliness,
                communication: reviewData.communication,
                accuracy: reviewData.accuracy,
                location: reviewData.location,
                checkin: reviewData.checkin,
                value: reviewData.value,
                respectRules: reviewData.respectRules,
                channel: reviewData.channel,
                type: reviewData.type,
                status: reviewData.status,
                submittedAt: reviewData.submittedAt,
              },
            });
            updatedCount++;
          } else {
            // Create new review
            await prisma.review.create({
              data: {
                ...reviewData,
                // Auto-approve reviews with rating >= 8
                approved: (reviewData.rating || 0) >= 8,
                // Feature reviews with rating >= 9.5
                featured: (reviewData.rating || 0) >= 9.5,
              },
            });
            newCount++;
          }
        } catch (error) {
          console.error("Error syncing review:", error);
          errorCount++;
        }
      }

    // Revalidate pages
    revalidatePath("/dashboard");
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (property) {
      revalidatePath(`/properties/${property.slug}`);
    }

    return {
      success: true,
      usingMockData,
      hostawayError: hostawayError ? {
        type: hostawayError.type,
        message: hostawayError.getUserMessage(),
        isRecoverable: hostawayError.isRecoverable(),
      } : null,
      summary: {
        new: newCount,
        updated: updatedCount,
        errors: errorCount,
        total: normalizedReviews.length,
      },
    };
  });


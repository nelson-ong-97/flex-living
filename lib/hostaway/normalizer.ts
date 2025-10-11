import { HostawayReview } from "./types";
import { CreateReviewInput } from "@/lib/schemas/review";

/**
 * Normalize Hostaway review to our database schema
 */
export function normalizeHostawayReview(
  review: HostawayReview,
  propertyId: string
): Omit<CreateReviewInput, "propertyId"> & { propertyId: string } {
  return {
    propertyId,
    source: "hostaway" as const,
    externalId: review.id.toString(),
    guestName: review.guestName,
    rating: review.rating,
    publicReview: review.publicReview || null,
    cleanliness: review.cleanliness || null,
    communication: review.communication || null,
    accuracy: review.accuracy || null,
    location: review.location || null,
    checkin: review.checkin || null,
    value: review.value || null,
    respectRules: review.respectRules || null,
    channel: review.channel || null,
    type: review.type || null,
    status: review.status,
    submittedAt: new Date(review.submittedAt),
  };
}

/**
 * Normalize multiple Hostaway reviews
 */
export function normalizeHostawayReviews(
  reviews: HostawayReview[],
  propertyId: string
): Array<Omit<CreateReviewInput, "propertyId"> & { propertyId: string }> {
  return reviews.map((review) => normalizeHostawayReview(review, propertyId));
}


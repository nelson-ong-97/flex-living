import { z } from "zod";

// Review source enum
export const reviewSourceSchema = z.enum(["hostaway", "google"]);

// Review status enum
export const reviewStatusSchema = z.enum([
  "published",
  "pending",
  "rejected",
]);

// Channel enum
export const channelSchema = z.enum([
  "airbnb",
  "booking.com",
  "vrbo",
  "direct",
  "other",
]);

// Base review schema
export const reviewSchema = z.object({
  id: z.string().cuid(),
  propertyId: z.string().cuid(),
  source: reviewSourceSchema,
  externalId: z.string(),
  guestName: z.string(),
  rating: z.number().min(0).max(10).nullable(),
  publicReview: z.string().nullable(),
  cleanliness: z.number().int().min(0).max(10).nullable(),
  communication: z.number().int().min(0).max(10).nullable(),
  accuracy: z.number().int().min(0).max(10).nullable(),
  location: z.number().int().min(0).max(10).nullable(),
  checkin: z.number().int().min(0).max(10).nullable(),
  value: z.number().int().min(0).max(10).nullable(),
  respectRules: z.number().int().min(0).max(10).nullable(),
  channel: z.string().nullable(),
  type: z.string().nullable(),
  status: z.string(),
  submittedAt: z.date(),
  approved: z.boolean(),
  featured: z.boolean(),
  displayOrder: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create review input schema
export const createReviewSchema = z.object({
  propertyId: z.string().cuid(),
  source: reviewSourceSchema,
  externalId: z.string(),
  guestName: z.string().min(1),
  rating: z.number().min(0).max(10).nullable().optional(),
  publicReview: z.string().nullable().optional(),
  cleanliness: z.number().int().min(0).max(10).nullable().optional(),
  communication: z.number().int().min(0).max(10).nullable().optional(),
  accuracy: z.number().int().min(0).max(10).nullable().optional(),
  location: z.number().int().min(0).max(10).nullable().optional(),
  checkin: z.number().int().min(0).max(10).nullable().optional(),
  value: z.number().int().min(0).max(10).nullable().optional(),
  respectRules: z.number().int().min(0).max(10).nullable().optional(),
  channel: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  status: z.string().default("published"),
  submittedAt: z.date(),
});

// Update review schema
export const updateReviewSchema = z.object({
  reviewId: z.string().cuid(),
  approved: z.boolean().optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().nullable().optional(),
});

// Approve review schema
export const approveReviewSchema = z.object({
  reviewId: z.string().cuid(),
  approved: z.boolean(),
});

// Bulk approve schema
export const bulkApproveSchema = z.object({
  reviewIds: z.array(z.string().cuid()).min(1),
  approved: z.boolean(),
});

// Get reviews filters schema
export const getReviewsFiltersSchema = z.object({
  propertyId: z.string().cuid().optional(),
  source: reviewSourceSchema.optional(),
  channel: z.string().optional(),
  approved: z.boolean().optional(),
  featured: z.boolean().optional(),
  minRating: z.number().min(0).max(10).optional(),
  maxRating: z.number().min(0).max(10).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["date", "rating", "property"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Property schema
export const propertySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  slug: z.string(),
  address: z.string().nullable(),
  googlePlaceId: z.string().nullable(),
  hostaway_id: z.number().int().nullable(),
  imageUrl: z.string().url().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create property schema
export const createPropertySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  address: z.string().nullable().optional(),
  googlePlaceId: z.string().nullable().optional(),
  hostaway_id: z.number().int().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  description: z.string().nullable().optional(),
});

// Export types
export type Review = z.infer<typeof reviewSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ApproveReviewInput = z.infer<typeof approveReviewSchema>;
export type BulkApproveInput = z.infer<typeof bulkApproveSchema>;
export type GetReviewsFilters = z.infer<typeof getReviewsFiltersSchema>;
export type Property = z.infer<typeof propertySchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type ReviewSource = z.infer<typeof reviewSourceSchema>;
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type Channel = z.infer<typeof channelSchema>;


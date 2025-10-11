"use server";

import { authActionClient } from "@/lib/safe-action";
import { hostawayClient } from "@/lib/hostaway/client";
import { normalizeHostawayReviews } from "@/lib/hostaway/normalizer";
import { z } from "zod";

const fetchHostawaySchema = z.object({
  propertyId: z.string().cuid(),
  listingId: z.number().int().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
});

export const fetchHostawayReviews = authActionClient
  .metadata({ actionName: "fetchHostawayReviews" })
  .inputSchema(fetchHostawaySchema)
  .action(async ({ parsedInput }) => {
    const { propertyId, listingId, startDate, endDate, status } = parsedInput;

    // Fetch reviews from Hostaway API
    const hostawayReviews = await hostawayClient.getReviews({
      listingId,
      startDate,
      endDate,
      status,
    });

    // Normalize reviews
    const normalizedReviews = normalizeHostawayReviews(
      hostawayReviews,
      propertyId
    );

    return {
      success: true,
      reviews: normalizedReviews,
      count: normalizedReviews.length,
    };
  });


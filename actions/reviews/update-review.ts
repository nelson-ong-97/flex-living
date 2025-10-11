"use server";

import { authActionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db/client";
import { updateReviewSchema } from "@/lib/schemas/review";
import { revalidatePath } from "next/cache";

export const updateReview = authActionClient
  .metadata({ actionName: "updateReview" })
  .inputSchema(updateReviewSchema)
  .action(async ({ parsedInput }) => {
    const { reviewId, ...updateData } = parsedInput;

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
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

    // Revalidate dashboard and property pages
    revalidatePath("/dashboard");
    revalidatePath(`/properties/${review.property.slug}`);

    return {
      success: true,
      review,
    };
  });


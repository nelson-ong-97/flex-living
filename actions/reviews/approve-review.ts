"use server";

import { authActionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db/client";
import { approveReviewSchema } from "@/lib/schemas/review";
import { revalidatePath } from "next/cache";

export const approveReview = authActionClient
  .metadata({ actionName: "approveReview" })
  .inputSchema(approveReviewSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { reviewId, approved } = parsedInput;

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { approved },
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


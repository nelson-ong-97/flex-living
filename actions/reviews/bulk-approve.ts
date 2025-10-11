"use server";

import { authActionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db/client";
import { bulkApproveSchema } from "@/lib/schemas/review";
import { revalidatePath } from "next/cache";

export const bulkApproveReviews = authActionClient
  .metadata({ actionName: "bulkApproveReviews" })
  .inputSchema(bulkApproveSchema)
  .action(async ({ parsedInput }) => {
    const { reviewIds, approved } = parsedInput;

    const result = await prisma.review.updateMany({
      where: {
        id: {
          in: reviewIds,
        },
      },
      data: {
        approved,
      },
    });

    // Revalidate dashboard
    revalidatePath("/dashboard");

    return {
      success: true,
      count: result.count,
    };
  });


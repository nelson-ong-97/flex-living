"use client";

import { useState, Fragment } from "react";
import { useAction } from "next-safe-action/hooks";
import { approveReview } from "@/actions/reviews/approve-review";
import { updateReview } from "@/actions/reviews/update-review";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Review {
  id: string;
  guestName: string;
  rating: number | null;
  publicReview: string | null;
  source: string;
  channel: string | null;
  submittedAt: Date;
  approved: boolean;
  featured: boolean;
  property: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ReviewsTableProps {
  reviews: Review[];
  onUpdate: () => void;
}

export function ReviewsTable({ reviews, onUpdate }: ReviewsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { execute: executeApprove, status: approveStatus } = useAction(
    approveReview,
    {
      onSuccess: () => {
        onUpdate();
      },
    }
  );

  const { execute: executeUpdate, status: updateStatus } = useAction(
    updateReview,
    {
      onSuccess: () => {
        onUpdate();
      },
    }
  );

  const handleApprove = (reviewId: string, approved: boolean) => {
    executeApprove({ reviewId, approved });
  };

  const handleToggleFeatured = (reviewId: string, featured: boolean) => {
    executeUpdate({ reviewId, featured });
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-500">No reviews found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <Fragment key={review.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {review.guestName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {review.property.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {review.rating?.toFixed(1) || "N/A"}
                      </span>
                      <span className="ml-1 text-yellow-400">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {review.source}
                    </span>
                    {review.channel && (
                      <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {review.channel}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(review.submittedAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {review.approved ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                      {review.featured && (
                        <span className="text-yellow-400">⭐</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      size="sm"
                      variant={review.approved ? "outline" : "default"}
                      onClick={() => handleApprove(review.id, !review.approved)}
                      disabled={approveStatus === "executing"}
                    >
                      {review.approved ? "Unapprove" : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleToggleFeatured(review.id, !review.featured)
                      }
                      disabled={updateStatus === "executing"}
                    >
                      {review.featured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setExpandedId(expandedId === review.id ? null : review.id)
                      }
                    >
                      {expandedId === review.id ? "Hide" : "View"}
                    </Button>
                  </td>
                </tr>
                {expandedId === review.id && review.publicReview && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 bg-gray-50">
                      <div className="text-sm text-gray-700">
                        <strong>Review:</strong>
                        <p className="mt-2">{review.publicReview}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


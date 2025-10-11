"use client";

import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { getProperty, getPublicReviews } from "@/actions/properties/get-properties";
import { ReviewCard } from "@/components/property/review-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use } from "react";

export default function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "featured">("recent");
  const [page, setPage] = useState(1);

  // Fetch property
  const {
    execute: fetchProperty,
    result: propertyResult,
    status: propertyStatus,
  } = useAction(getProperty);

  // Fetch reviews
  const {
    execute: fetchReviews,
    result: reviewsResult,
    status: reviewsStatus,
  } = useAction(getPublicReviews);

  useEffect(() => {
    fetchProperty({ slug });
  }, [slug]);

  useEffect(() => {
    if (propertyResult?.data?.property) {
      fetchReviews({
        propertyId: propertyResult.data.property.id,
        sortBy,
        page,
        limit: 12,
      });
    }
  }, [propertyResult?.data?.property?.id, sortBy, page]);

  const property = propertyResult?.data?.property;
  const reviews = reviewsResult?.data?.reviews || [];
  const pagination = reviewsResult?.data?.pagination;

  if (propertyStatus === "executing") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-500 mb-4">
            The property you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Properties
          </Link>
        </div>
      </div>

      {/* Property Hero */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-200">
              {property.imageUrl ? (
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {property.name}
              </h1>
              {property.address && (
                <p className="text-gray-600 mb-4">📍 {property.address}</p>
              )}
              {property.description && (
                <p className="text-gray-700 mb-6">{property.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {property.averageRating.toFixed(1)}
                    </span>
                    <span className="text-yellow-400 text-2xl">★</span>
                  </div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                <div className="border-l border-gray-300 pl-6">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {property.reviewCount}
                  </div>
                  <p className="text-sm text-gray-600">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as "recent" | "rating" | "featured");
                setPage(1);
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        {reviewsStatus === "executing" ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No reviews yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


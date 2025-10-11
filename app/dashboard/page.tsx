"use client";

import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { getReviews } from "@/actions/reviews/get-reviews";
import { getReviewStats } from "@/actions/reviews/get-stats";
import { getProperties } from "@/actions/properties/get-properties";
import { syncReviews } from "@/actions/reviews/sync-reviews";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Filters } from "@/components/dashboard/filters";
import { ReviewsTable } from "@/components/dashboard/reviews-table";
import { Button } from "@/components/ui/button";
import { useFiltersStore } from "@/store/filters";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const filters = useFiltersStore();
  const [properties, setProperties] = useState<
    Array<{ id: string; name: string; hostaway_id: number | null }>
  >([]);

  // Fetch properties
  const { execute: fetchProperties } = useAction(getProperties, {
    onSuccess: ({ data }) => {
      if (data?.properties) {
        setProperties(
          data.properties.map((p) => ({
            id: p.id,
            name: p.name,
            hostaway_id: p.hostaway_id
          }))
        );
      }
    },
  });

  // Fetch stats
  const {
    execute: fetchStats,
    result: statsResult,
    status: statsStatus,
  } = useAction(getReviewStats);

  // Fetch reviews
  const {
    execute: fetchReviews,
    result: reviewsResult,
    status: reviewsStatus,
  } = useAction(getReviews);

  // Sync reviews
  const { execute: executeSyncReviews, status: syncStatus, result: syncResult } = useAction(
    syncReviews,
    {
      onSuccess: ({ data }) => {
        console.log("Sync successful:", data);
        loadData();
      },
      onError: ({ error }) => {
        console.error("Sync failed:", error);
      },
    }
  );

  const loadData = () => {
    fetchStats({});
    fetchReviews({
      propertyId: filters.propertyId,
      source: filters.source,
      channel: filters.channel,
      approved: filters.approved,
      featured: filters.featured,
      minRating: filters.minRating,
      maxRating: filters.maxRating,
      startDate: filters.startDate,
      endDate: filters.endDate,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: filters.page,
      limit: filters.limit,
    });
  };

  useEffect(() => {
    fetchProperties();
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [
    filters.propertyId,
    filters.source,
    filters.channel,
    filters.approved,
    filters.featured,
    filters.minRating,
    filters.maxRating,
    filters.startDate,
    filters.endDate,
    filters.search,
    filters.sortBy,
    filters.sortOrder,
    filters.page,
    filters.limit,
  ]);

  const stats = statsResult?.data || {
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
    featuredReviews: 0,
    averageRating: 0,
  };

  const reviews = reviewsResult?.data?.reviews || [];
  const pagination = reviewsResult?.data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reviews Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor your property reviews
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (properties.length > 0) {
                    const firstProperty = properties[0];
                    executeSyncReviews({
                      propertyId: firstProperty.id,
                      listingId: firstProperty.hostaway_id || undefined,
                    });
                  }
                }}
                disabled={syncStatus === "executing" || properties.length === 0}
              >
                {syncStatus === "executing" ? "Syncing..." : "Sync Reviews"}
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                View Public Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Sync Result */}
        {syncResult?.data && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              ✅ Sync Completed Successfully
            </h3>
            <div className="text-sm text-green-700">
              <p>New reviews: {syncResult.data.summary.new}</p>
              <p>Updated reviews: {syncResult.data.summary.updated}</p>
              <p>Errors: {syncResult.data.summary.errors}</p>
              <p>Total processed: {syncResult.data.summary.total}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        {statsStatus === "executing" ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading stats...</p>
          </div>
        ) : (
          <StatsCards stats={stats} />
        )}

        {/* Filters */}
        <Filters properties={properties} />

        {/* Reviews Table */}
        {reviewsStatus === "executing" ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        ) : (
          <>
            <ReviewsTable reviews={reviews} onUpdate={loadData} />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-lg shadow-sm px-6 py-4">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                  of {pagination.total} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => filters.setPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => filters.setPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


"use client";

import { useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { getProperties } from "@/actions/properties/get-properties";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { execute, result, status } = useAction(getProperties);

  useEffect(() => {
    execute();
  }, []);

  const properties = result?.data?.properties || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Flex Living Properties
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Discover our premium vacation rentals
              </p>
            </div>
            <Link href="/auth/login">
              <Button>Manager Login</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {status === "executing" ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    {property.imageUrl ? (
                      <img
                        src={property.imageUrl}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {property.name}
                    </h2>
                    {property.address && (
                      <p className="text-sm text-gray-600 mb-4">
                        📍 {property.address}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">
                          {property.averageRating.toFixed(1)}
                        </span>
                        <span className="text-yellow-400">★</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {property.reviewCount} reviews
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 Flex Living. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

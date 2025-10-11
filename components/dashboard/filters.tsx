"use client";

import { useFiltersStore } from "@/store/filters";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  properties: Array<{ id: string; name: string }>;
}

export function Filters({ properties }: FiltersProps) {
  const {
    propertyId,
    source,
    channel,
    approved,
    search,
    sortBy,
    sortOrder,
    setPropertyId,
    setSource,
    setChannel,
    setApproved,
    setSearch,
    setSortBy,
    setSortOrder,
    resetFilters,
  } = useFiltersStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Property Filter */}
        <div>
          <Label htmlFor="property">Property</Label>
          <select
            id="property"
            value={propertyId || ""}
            onChange={(e) => setPropertyId(e.target.value || undefined)}
            className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Properties</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <Label htmlFor="source">Source</Label>
          <select
            id="source"
            value={source || ""}
            onChange={(e) =>
              setSource(e.target.value as "hostaway" | "google" | undefined)
            }
            className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Sources</option>
            <option value="hostaway">Hostaway</option>
            <option value="google">Google</option>
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <Label htmlFor="channel">Channel</Label>
          <select
            id="channel"
            value={channel || ""}
            onChange={(e) => setChannel(e.target.value || undefined)}
            className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Channels</option>
            <option value="airbnb">Airbnb</option>
            <option value="booking.com">Booking.com</option>
            <option value="vrbo">VRBO</option>
            <option value="google">Google</option>
          </select>
        </div>

        {/* Approval Status */}
        <div>
          <Label htmlFor="approved">Status</Label>
          <select
            id="approved"
            value={approved === undefined ? "" : approved.toString()}
            onChange={(e) =>
              setApproved(
                e.target.value === "" ? undefined : e.target.value === "true"
              )
            }
            className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
        </div>

        {/* Search */}
        <div className="md:col-span-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by guest name or review text..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value || undefined)}
            className="mt-1"
          />
        </div>

        {/* Sort By */}
        <div>
          <Label htmlFor="sortBy">Sort By</Label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "rating" | "property")
            }
            className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="date">Date</option>
            <option value="rating">Rating</option>
            <option value="property">Property</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <Label htmlFor="sortOrder">Order</Label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
}


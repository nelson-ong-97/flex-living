import { create } from "zustand";

interface FiltersState {
  propertyId?: string;
  source?: "hostaway" | "google";
  channel?: string;
  approved?: boolean;
  featured?: boolean;
  minRating?: number;
  maxRating?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  sortBy: "date" | "rating" | "property";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;

  // Actions
  setPropertyId: (propertyId?: string) => void;
  setSource: (source?: "hostaway" | "google") => void;
  setChannel: (channel?: string) => void;
  setApproved: (approved?: boolean) => void;
  setFeatured: (featured?: boolean) => void;
  setRatingRange: (min?: number, max?: number) => void;
  setDateRange: (start?: Date, end?: Date) => void;
  setSearch: (search?: string) => void;
  setSortBy: (sortBy: "date" | "rating" | "property") => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
}

const initialState = {
  sortBy: "date" as const,
  sortOrder: "desc" as const,
  page: 1,
  limit: 20,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initialState,

  setPropertyId: (propertyId) => set({ propertyId, page: 1 }),
  setSource: (source) => set({ source, page: 1 }),
  setChannel: (channel) => set({ channel, page: 1 }),
  setApproved: (approved) => set({ approved, page: 1 }),
  setFeatured: (featured) => set({ featured, page: 1 }),
  setRatingRange: (minRating, maxRating) => set({ minRating, maxRating, page: 1 }),
  setDateRange: (startDate, endDate) => set({ startDate, endDate, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setSortOrder: (sortOrder) => set({ sortOrder, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  resetFilters: () => set(initialState),
}));


/**
 * A custom React hook for filtering a list of shortened URLs based on search query and status filter.
 * This hook provides state management for the search query and status filter, and computes the filtered list of URLs.
 * It also provides a function to clear all active filters.
 * @param urls - The list of shortened URLs to be filtered.
 * @returns An object containing the current search query, status filter, filtered URLs, 
 * a boolean indicating if any filters are active, and functions to update the search query, 
 * status filter, and clear all filters.
 */
import { useMemo, useState } from "react";

import type { ShortUrl, UrlStatus } from "../types/url";

export type StatusFilter = "all" | UrlStatus;

interface UseUrlFiltersResult {
  searchQuery: string;
  statusFilter: StatusFilter;
  filteredUrls: ShortUrl[];
  hasActiveFilters: boolean;
  setSearchQuery: (value: string) => void;
  setStatusFilter: (value: StatusFilter) => void;
  clearFilters: () => void;
}

export const useUrlFilters = (
  urls: ShortUrl[]
): UseUrlFiltersResult => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const filteredUrls = useMemo(() => {
    const normalizedQuery =
      searchQuery.trim().toLowerCase();

    return urls.filter((url) => {
      const matchesSearch =
        !normalizedQuery ||
        url.shortCode
          .toLowerCase()
          .includes(normalizedQuery) ||
        url.originalUrl
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "all" ||
        url.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [urls, searchQuery, statusFilter]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  return {
    searchQuery,
    statusFilter,
    filteredUrls,
    hasActiveFilters,
    setSearchQuery,
    setStatusFilter,
    clearFilters,
  };
};
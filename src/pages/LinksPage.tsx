/**
 * The LinksPage component is responsible for displaying a list of shortened URLs, 
 * along with search and filter functionality. It fetches the user's URLs using the 
 * useUrls hook and allows users to search by short code or original URL, 
 * as well as filter by status (active, inactive, etc.). 
 * The component handles loading states, error states, and 
 * displays appropriate messages when there are no links or when filters yield no results. 
 * It also provides a button to create new short URLs and displays the results in either a 
 * table format for desktop or card format for mobile.
 * 
 * The  UX rendering business logic is as follows:
 * 1. Fetch URLs using the useUrls hook.
 * 2. Apply search and status filters using the useUrlFilters hook.
 * 3. Display loading skeleton while fetching data.
 * 4. Handle and display error messages if fetching fails.
 * 5. Show an empty state if there are no URLs or if filters yield no results.
 * 6. Render the filtered list of URLs in a table for desktop or cards for mobile.
 * 7. Provide a button to create new short URLs.
 * 8. Display the count of filtered results versus total results.
 */
import { Link } from "react-router-dom";

import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";

import UrlCard from "@/components/urls/UrlCard";
import UrlTable from "@/components/urls/UrlTable";
import UrlListSkeleton from "@/components/urls/UrlListSkeleton";

import { URL_CONFIG } from "@/config/url.config";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import type { StatusFilter } from "@/hooks/useUrlFilters";
import { useUrls } from "@/hooks/useUrls";

const LinksPage = () => {
  const {
    urls,
    isLoading,
    error,
    refetch,
  } = useUrls();

  const {
    searchQuery,
    statusFilter,
    filteredUrls,
    hasActiveFilters,
    setSearchQuery,
    setStatusFilter,
    clearFilters,
  } = useUrlFilters(urls);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Your Links
          </h2>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Manage and track your shortened URLs.
          </p>
        </div>

        <Link to="/">
          <Button className="w-full sm:w-auto">
            Create Short URL
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="flex-1">
          <Input
            id="search"
            label="Search"
            placeholder="Search by short code or destination..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
          />
        </div>

        <div className="sm:w-48">
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                 event.target.value as StatusFilter
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            {URL_CONFIG.statusFilters.map((filter) => (
              <option
                key={filter.value}
                value={filter.value}
              >
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {/* Loading */}
        {isLoading && <UrlListSkeleton />}

        {/* Error */}
        {!isLoading && error && (
          <EmptyState
            title="Something went wrong"
            description={error}
            action={
              <Button
                type="button"
                onClick={() => void refetch()}
              >
                Try Again
              </Button>
            }
          />
        )}

        {/* No URLs */}
        {!isLoading &&
          !error &&
          urls.length === 0 && (
            <EmptyState
              title="No links yet"
              description="Create your first short URL and it will appear here."
              action={
                <Link to="/">
                  <Button>
                    Create Short URL
                  </Button>
                </Link>
              }
            />
          )}

        {/* No search/filter results */}
        {!isLoading &&
          !error &&
          urls.length > 0 &&
          filteredUrls.length === 0 && (
            <EmptyState
              title="No links found"
              description="Try changing your search or status filter."
              action={
                hasActiveFilters ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                ) : undefined
              }
            />
          )}

        {/* Results */}
        {!isLoading &&
          !error &&
          filteredUrls.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <UrlTable urls={filteredUrls} />
              </div>

              {/* Mobile cards */}
              <div className="space-y-4 md:hidden">
                {filteredUrls.map((url) => (
                  <UrlCard
                    key={url.id}
                    url={url}
                  />
                ))}
              </div>
            </>
          )}
      </div>

      {/* Result count */}
      {!isLoading &&
        !error &&
        urls.length > 0 &&
        filteredUrls.length > 0 && (
          <p className="mt-4 text-sm text-slate-500">
            Showing {filteredUrls.length} of{" "}
            {urls.length} links
          </p>
        )}
    </main>
  );
};

export default LinksPage;
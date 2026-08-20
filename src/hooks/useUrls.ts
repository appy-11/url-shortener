/**
 * A custom React hook for fetching and managing a list of shortened URLs.
 * This hook provides state management for the list of URLs, loading state, error handling, and a refetch function.
 * It fetches the list of shortened URLs from the backend service and updates the state accordingly.
 * @returns An object containing the list of URLs, loading state, error message (if any), and a refetch function.
 */
import { useCallback, useEffect, useState } from "react";

import { getShortUrls } from "../services/url.service";
import type { ShortUrl } from "../types/url";

interface UseUrlsResult {
  urls: ShortUrl[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUrls = (): UseUrlsResult => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUrls = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getShortUrls();

      setUrls(data);
    } catch {
      setError(
        "Unable to load your links. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUrls();
  }, [fetchUrls]);

  return {
    urls,
    isLoading,
    error,
    refetch: fetchUrls,
  };
};
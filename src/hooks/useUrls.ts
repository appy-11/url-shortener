/**
 * A custom React hook for fetching and managing a list of shortened URLs.
 * This hook provides state management for the list of URLs, loading state, error handling, and a refetch function.
 * This uses the useAsync hook to handle the asynchronous fetching of URL data
 * It fetches the list of shortened URLs from the backend service and updates the state accordingly.
 * @returns An object containing the list of URLs, loading state, error message (if any), and a refetch function.
 */
import { useCallback } from 'react'

import { useAsync } from './useAsync'
import { getShortUrls } from '../services/url.service'

import type { ShortUrl } from '../types/url'

interface UseUrlsResult {
  urls: ShortUrl[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useUrls = (): UseUrlsResult => {
  const fetchUrls = useCallback(() => getShortUrls(), [])

  const { data, isLoading, error, execute } = useAsync(fetchUrls)

  return {
    urls: data ?? [],
    isLoading,
    error,
    refetch: execute,
  }
}

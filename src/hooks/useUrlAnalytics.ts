/**
 * A custom React hook that fetches and manages analytics data for a given URL ID.
 * This hook provides the analytics data, loading state, error state, and a refetch function.
 * This uses the useAsync hook to handle the asynchronous fetching of analytics data and manage the associated state.
 * It uses the `getUrlAnalytics` service function to retrieve the analytics data from the backend.
 * @param id - The unique identifier of the short URL for which to fetch analytics data.
 * @returns An object containing the analytics data, loading state, error state, and a refetch function.
 */
import { useCallback } from 'react'

import { useAsync } from './useAsync'
import { getUrlAnalytics } from '../services/url.service'

import type { UrlAnalytics } from '../types/url'

interface UseUrlAnalyticsResult {
  analytics: UrlAnalytics | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useUrlAnalytics = (id: string | undefined): UseUrlAnalyticsResult => {
  const fetchAnalytics = useCallback(() => {
    if (!id) {
      return Promise.reject(new Error('Invalid URL.'))
    }

    return getUrlAnalytics(id)
  }, [id])

  const { data, isLoading, error, execute } = useAsync(fetchAnalytics)

  return {
    analytics: data,
    isLoading,
    error,
    refetch: execute,
  }
}

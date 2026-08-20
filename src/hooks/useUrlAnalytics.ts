/**
 * A custom React hook that fetches and manages analytics data for a given URL ID.
 * This hook provides the analytics data, loading state, error state, and a refetch function.
 * It uses the `getUrlAnalytics` service function to retrieve the analytics data from the backend.
 * @param id - The unique identifier of the short URL for which to fetch analytics data.
 * @returns An object containing the analytics data, loading state, error state, and a refetch function.
 */
import { useCallback, useEffect, useState } from 'react'

import { getUrlAnalytics } from '../services/url.service'
import type { UrlAnalytics } from '../types/url'

interface UseUrlAnalyticsResult {
  analytics: UrlAnalytics | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useUrlAnalytics = (id: string | undefined): UseUrlAnalyticsResult => {
  const [analytics, setAnalytics] = useState<UrlAnalytics | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    if (!id) {
      setError('Invalid URL.')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const data = await getUrlAnalytics(id)

      setAnalytics(data)
    } catch {
      setAnalytics(null)
      setError('Unable to load analytics for this URL.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    void fetchAnalytics()
  }, [fetchAnalytics])

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics,
  }
}

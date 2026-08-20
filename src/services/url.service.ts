/**
 * This module provides mock implementations of URL-related services for testing and development purposes.
 * It simulates API calls for fetching shortened URLs, retrieving analytics data, and creating new shortened URLs.
 * The mock implementations introduce artificial delays to mimic real-world network latency.
 * These services return predefined mock data to facilitate testing and development without relying on a live backend.
 * The module exports the following functions:
 * - `getShortUrls`: Fetches a list of shortened URLs.
 * - `getUrlAnalytics`: Retrieves analytics data for a specific shortened URL by its ID.
 * - `createShortUrl`: Creates a new shortened URL based on the provided payload.
 */
import { MOCK_CLICK_HISTORY } from '../data/analytics.data'
import { MOCK_URLS } from '../data/url.data'

import type { CreateUrlPayload, ShortUrl, UrlAnalytics } from '../types/url'

const MOCK_API_DELAY = 800

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

export const getShortUrls = async (): Promise<ShortUrl[]> => {
  await delay(MOCK_API_DELAY)

  return MOCK_URLS
}

export const getUrlAnalytics = async (id: string): Promise<UrlAnalytics> => {
  await delay(MOCK_API_DELAY)

  const url = MOCK_URLS.find((item) => item.id === id)

  if (!url) {
    throw new Error('URL not found')
  }

  return {
    url,
    clickHistory: MOCK_CLICK_HISTORY,
  }
}

export const createShortUrl = async (payload: CreateUrlPayload): Promise<ShortUrl> => {
  await delay(MOCK_API_DELAY)

  const shortCode = payload.alias || Math.random().toString(36).substring(2, 7)

  return {
    id: crypto.randomUUID(),
    shortCode,
    originalUrl: payload.url,
    clicks: 0,
    createdAt: new Date().toISOString(),
    expiresAt: null,
    status: 'active',
  }
}

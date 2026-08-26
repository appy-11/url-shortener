/**
 * This module provides URL-related API services for the application.
 * It communicates with the backend URL APIs and maps API responses
 * to the frontend URL types used throughout the application.
 *
 * The module exports the following functions:
 * - `getShortUrls`: Fetches all shortened URLs.
 * - `getUrlAnalytics`: Retrieves analytics data for a specific shortened URL.
 * - `createShortUrl`: Creates a new shortened URL.
 */
import { apiClient } from './api.client'

import type { CreateUrlPayload, ExpiryOption, ShortUrl, UrlAnalytics } from '../types/url'

interface CreateUrlResponse {
  id: string
  shortUrl: string
  shortCode: string
  originalUrl: string
  expiresAt: string | null
  createdAt: string
}

interface UrlResponse {
  id: string
  shortCode: string
  originalUrl: string
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  clicks: number
  status: 'active' | 'expired'
}

interface UrlAnalyticsResponse {
  url: UrlResponse
  clickHistory: {
    date: string
    clicks: number
  }[]
}

/**
 * Converts the frontend expiry option into an absolute ISO timestamp.
 *
 * The frontend uses simple values such as `1h` and `7d`,
 * while the backend expects an actual expiry timestamp.
 */
const getExpiryDate = (expiry: ExpiryOption | undefined): string | undefined => {
  if (!expiry || expiry === 'never') {
    return undefined
  }

  const durations: Record<Exclude<ExpiryOption, 'never'>, number> = {
    '1h': 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  }

  return new Date(Date.now() + durations[expiry]).toISOString()
}

/**
 * Maps a backend URL response to the frontend ShortUrl type.
 */
const mapUrlResponse = (url: UrlResponse): ShortUrl => {
  return {
    id: url.id,
    shortCode: url.shortCode,
    originalUrl: url.originalUrl,
    clicks: url.clicks,
    createdAt: url.createdAt,
    expiresAt: url.expiresAt,
    status: url.status,
  }
}

/**
 * Fetches all shortened URLs from the backend.
 */
export const getShortUrls = async (): Promise<ShortUrl[]> => {
  const response = await apiClient.get<UrlResponse[]>('/api/urls')

  return response.map(mapUrlResponse)
}

/**
 * Retrieves analytics data for a specific shortened URL.
 */
export const getUrlAnalytics = async (id: string): Promise<UrlAnalytics> => {
  const response = await apiClient.get<UrlAnalyticsResponse>(`/api/urls/${id}/analytics`)

  return {
    url: mapUrlResponse(response.url),
    clickHistory: response.clickHistory,
  }
}

/**
 * Creates a new shortened URL using the backend API.
 */
export const createShortUrl = async (payload: CreateUrlPayload): Promise<ShortUrl> => {
  const response = await apiClient.post<CreateUrlResponse>('/api/urls', {
    longUrl: payload.url,
    customAlias: payload.alias || undefined,
    expiresAt: getExpiryDate(payload.expiry),
  })

  return {
    id: response.id,
    shortCode: response.shortCode,
    originalUrl: response.originalUrl,
    clicks: 0,
    createdAt: response.createdAt,
    expiresAt: response.expiresAt,
    status: 'active',
  }
}

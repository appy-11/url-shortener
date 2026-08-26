/**
 * Type definitions for URL-related data structures and options.
 * This file defines the types used for creating and managing short URLs,
 * including payloads for URL creation, the structure of a short URL,
 * and the possible expiry options and statuses.
 */

/**
 * Expiry options for short URLs.
 * These options define the possible durations for which a short URL can remain valid.
 * The options include "never", "1 hour", "1 day", "7 days", "30 days", and a custom option.
 */
export type ExpiryOption = 'never' | '1h' | '1d' | '7d' | '30d'

/**
 * Status of a short URL.
 * This type defines the possible states of a short URL, which can be either "active" or "expired".
 * It is used to indicate whether a short URL is currently valid or has expired.
 */
export type UrlStatus = 'active' | 'expired'

/**
 * Payload for creating a new short URL.
 * This interface defines the structure of the data required to create a new short URL.
 * It includes the original URL, an optional alias, and an optional expiry option.
 */
export interface CreateUrlPayload {
  url: string
  alias?: string
  expiry?: ExpiryOption
}

/**
 * Structure of a short URL.
 * This interface defines the properties of a short URL,
 * including its unique ID, short code, original URL, click count,
 * creation date, expiry date, and status.
 * It is used to represent a short URL in the application and manage its associated data.
 */
export interface ShortUrl {
  id: string
  shortCode: string
  originalUrl: string
  clicks: number
  createdAt: string
  expiresAt: string | null
  status: UrlStatus
}

/**
 * Data point representing the number of clicks on a short URL at a specific date.
 * This interface defines the structure of a click data point, which includes the date and the number of clicks.
 * It is used to track the click history of a short URL over time.
 */
export interface ClickDataPoint {
  date: string
  clicks: number
}

/**
 * Analytics data for a short URL.
 * This interface defines the structure of the analytics data for a short URL,
 * including the short URL itself and an array of click data points representing the click history.
 * It is used to provide insights into the performance and usage of a short URL.
 */
export interface UrlAnalytics {
  url: ShortUrl
  clickHistory: ClickDataPoint[]
}

/**
 * This module defines the types used in the URL shortening service.
 * It includes interfaces for the input data required to create a short URL and the structure of a URL record stored in the database.
 * The types ensure type safety and consistency across the application when working with URL-related data.
 */

/**
 * This interface defines the structure of the input data required to create a short URL.
 * It includes the original long URL, an optional custom alias for the short URL, and an optional expiration date.
 */
export interface CreateUrlInput {
  longUrl: string
  customAlias?: string
  expiresAt?: string
}

/**
 * This interface defines the structure of a URL record that is stored in the database.
 * It includes the ID, short code, original URL, optional expiration date, and timestamps for creation and last update.
 */
export interface UrlRecord {
  id: bigint
  shortCode: string
  originalUrl: string
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}
/**
 * This interface defines the structure of a URL record along with its analytics and status of shortUrl
 */
export interface UrlListItem extends UrlRecord {
  clicks: number
  status: 'active' | 'expired'
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
  url: UrlListItem
  clickHistory: ClickDataPoint[]
}

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

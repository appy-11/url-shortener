/**
 * This file defines constants and utility functions for generating Redis cache keys related to URL shortening.
 * The `URL_CACHE_PREFIX` constant is used as a prefix for all URL-related cache keys.
 * The `getUrlCacheKey` function generates a cache key for a given short code by combining the prefix and the short code.
 */
export const URL_CACHE_PREFIX = 'url'

export const getUrlCacheKey = (shortCode: string): string => {
  return `${URL_CACHE_PREFIX}:${shortCode}`
}

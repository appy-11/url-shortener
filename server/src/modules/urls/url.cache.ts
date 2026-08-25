/**
 * This file is responsible for caching URL records in Redis.
 * It provides functions to get, set, and delete cached URL records based on their short codes.
 * The cache is used to improve performance by reducing the number of database queries for frequently accessed URLs.
 * The cached URL records are serialized and deserialized to and from JSON format for storage in Redis.
 * Redis keys are generated using a prefix and the short code to ensure uniqueness and avoid key collisions.
 * The cache expiration time is set based on the URL's expiration date,
 * if provided, to ensure that expired URLs are automatically removed from the cache.
 * Redis stores keys as strings, so the URL record's ID is converted to a string for caching and
 * converted back to a bigint when retrieved from the cache.
 */
import { redis } from '../../infrastructure/redis/client.js'
import { getUrlCacheKey } from '../../infrastructure/redis/keys.js'

import type { UrlRecord } from './url.types.js'

interface CachedUrl {
  id: string
  shortCode: string
  originalUrl: string
  expiresAt: string | null
}

// Serialize and deserialize functions for caching URL records in Redis
const serializeUrl = (url: UrlRecord): CachedUrl => {
  return {
    id: url.id.toString(),
    shortCode: url.shortCode,
    originalUrl: url.originalUrl,
    expiresAt: url.expiresAt?.toISOString() ?? null,
  }
}

const deserializeUrl = (data: string): UrlRecord => {
  const cached = JSON.parse(data) as CachedUrl

  return {
    id: BigInt(cached.id),
    shortCode: cached.shortCode,
    originalUrl: cached.originalUrl,
    expiresAt: cached.expiresAt ? new Date(cached.expiresAt) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 *  Retrieves a cached URL record from Redis based on the provided short code.
 *  If the record is found in the cache, it is deserialized and returned as a UrlRecord object.
 *  If the record is not found, null is returned.
 * @param shortCode Short code of the URL to retrieve from the cache.
 * @returns A promise resolving to the cached UrlRecord or null.
 */
export const getCachedUrl = async (shortCode: string): Promise<UrlRecord | null> => {
  // Generate the Redis cache key for the given short code
  const key = getUrlCacheKey(shortCode)

  // Attempt to retrieve the cached URL record from Redis
  const cached = await redis.get(key)

  // If the record is not found in the cache, return null
  if (!cached) {
    return null
  }

  // If the record is found, deserialize it and return as a UrlRecord object
  return deserializeUrl(cached)
}

/**
 * Caches a URL record in Redis.
 * @param url The URL record to cache.
 * @returns A promise resolving when the URL is cached.
 */
export const cacheUrl = async (url: UrlRecord): Promise<void> => {
  // Generate the Redis cache key for the given short code
  const key = getUrlCacheKey(url.shortCode)

  // Serialize the UrlRecord object to a JSON string for caching
  const serialized = JSON.stringify(serializeUrl(url))

  // If the URL has an expiration date, calculate the TTL (time-to-live) in seconds
  // and set the cache with an expiration time. Otherwise, set the cache without expiration.
  if (url.expiresAt) {
    const ttl = Math.max(1, Math.floor((url.expiresAt.getTime() - Date.now()) / 1000))

    await redis.set(key, serialized, {
      EX: ttl,
    })

    return
  }

  // set the cache without expiration if there is no expiration date
  await redis.set(key, serialized)
}

/**
 * Deletes a cached URL record from Redis based on the provided short code.
 * @param shortCode Short code of the URL to delete from the cache.
 * @returns A promise resolving when the URL is deleted from the cache.
 */
export const deleteCachedUrl = async (shortCode: string): Promise<void> => {
  //Delete the cached URL record from Redis using the generated cache key
  await redis.del(getUrlCacheKey(shortCode))
}

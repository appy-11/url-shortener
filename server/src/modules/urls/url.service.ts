/**
 * This module defines the service layer for handling URL-related operations in the application.
 * It provides functions for creating short URLs, validating input, and interacting with the URL repository.
 * The service layer encapsulates the business logic and ensures that the input data is valid before performing database operations.
 */
import { ApiError } from '../../utils/api-error.js'
import { encodeBase62 } from '../../utils/base62.js'

import { createUrl, getNextUrlId } from './url.repository.js'

import { validateCreateUrl } from './url.validation.js'

import type { CreateUrlInput, UrlRecord } from './url.types.js'

import { cacheUrl, getCachedUrl } from './url.cache.js'

import { findUrlByShortCode } from './url.repository.js'

/**
 * Creates a short URL based on the provided input.
 * @param input - The input data for creating the short URL.
 * @returns A promise resolving to the created UrlRecord.
 * @throws ApiError if the input validation fails or if there is a database error.
 */
export const createShortUrl = async (input: CreateUrlInput): Promise<UrlRecord> => {
  // Validate the input data using the validateCreateUrl function.
  const validationError = validateCreateUrl(input)

  // If there is a validation error, throw a UrlValidationError with the error message.
  if (validationError) {
    throw new ApiError(400, 'INVALID_REQUEST', validationError)
  }

  // Get the next available URL ID from the repository.
  const id = await getNextUrlId()

  // Generate a short code for the URL. If a custom alias is provided, use it; otherwise, encode the ID using base62 encoding.
  const shortCode = input.customAlias ?? encodeBase62(id)

  // Create a new URL record in the database using the createUrl function and return the created UrlRecord.
  return createUrl({
    id,
    shortCode,
    originalUrl: input.longUrl,
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
  })
}

/**
 * Resolves a short URL based on its short code.
 * @param shortCode The short code of the URL to resolve.
 * @returns A promise resolving to the resolved UrlRecord.
 * @throws ApiError if the URL is not found or has expired.
 */
export const resolveShortUrl = async (shortCode: string): Promise<UrlRecord> => {
  // Attempt to retrieve the cached URL record from Redis using the provided short code.
  const cachedUrl = await getCachedUrl(shortCode)

  // If a cached URL record is found, check if it has expired. If it has expired, throw an ApiError with a 410 status code.
  if (cachedUrl) {
    if (cachedUrl.expiresAt && cachedUrl.expiresAt <= new Date()) {
      throw new ApiError(410, 'URL_EXPIRED', 'This shortened URL has expired.')
    }

    return cachedUrl
  }

  // If the URL record is not found in the cache, query the database to find the URL record by its short code.
  const url = await findUrlByShortCode(shortCode)

  // If the URL record is not found in the database, throw an ApiError with a 404 status code.
  if (!url) {
    throw new ApiError(404, 'URL_NOT_FOUND', 'The requested shortened URL was not found.')
  }

  // If the URL record is found, check if it has expired. If it has expired, throw an ApiError with a 410 status code.
  if (url.expiresAt && url.expiresAt <= new Date()) {
    throw new ApiError(410, 'URL_EXPIRED', 'This shortened URL has expired.')
  }

  // Cache the resolved URL record in Redis for future requests.
  await cacheUrl(url)

  // Return the resolved UrlRecord.
  return url
}

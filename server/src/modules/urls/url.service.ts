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

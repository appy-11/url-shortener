/**
 * This module defines the service layer for handling URL-related operations in the application.
 * It provides functions for creating short URLs, validating input, and interacting with the URL repository.
 * The service layer encapsulates the business logic and ensures that the input data is valid before performing database operations.
 */

import { encodeBase62 } from '../../utils/base62.js'

import { createUrl, getNextUrlId } from './url.repository.js'

import { validateCreateUrl } from './url.validation.js'

import type { CreateUrlInput, UrlRecord } from './url.types.js'

/**
 * Custom error class for URL validation errors.
 * It extends the built-in Error class and is used to indicate validation failures when creating short URLs.
 */
export class UrlValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UrlValidationError'
  }
}

/**
 * Creates a short URL based on the provided input.
 * @param input - The input data for creating the short URL.
 * @returns A promise resolving to the created UrlRecord.
 */
export const createShortUrl = async (input: CreateUrlInput): Promise<UrlRecord> => {
  // Validate the input data using the validateCreateUrl function.
  const validationError = validateCreateUrl(input)

  // If there is a validation error, throw a UrlValidationError with the error message.
  if (validationError) {
    throw new UrlValidationError(validationError)
  }

  // Get the next available URL ID from the repository.
  const id = await getNextUrlId()

  // Generate a short code for the URL. If a custom alias is provided, use it; otherwise, encode the ID using base62 encoding.
  const shortCode = input.customAlias ?? encodeBase62(id)

  // Convert the expiresAt string to a Date object if it is provided; otherwise, set it to null.
  const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null

  // Create a new URL record in the database using the createUrl function from the repository.
  return createUrl({
    id,
    shortCode,
    originalUrl: input.longUrl,
    expiresAt,
  })
}

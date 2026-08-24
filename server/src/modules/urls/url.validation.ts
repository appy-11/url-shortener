/**
 * This module provides validation functions for URL-related operations in the URL shortening service.
 * It includes a function to validate the input data required to create a short URL.
 * The validation ensures that the input meets the expected format and constraints before proceeding with URL creation.
 */
import type { CreateUrlInput } from './url.types.js'

const ALIAS_PATTERN = /^[a-zA-Z0-9_-]+$/

/**
 * Validates the input data for creating a short URL.
 * @param input The input data to validate.
 * @returns An error message if the input is invalid, or null if it is valid.
 */
export const validateCreateUrl = (input: CreateUrlInput): string | null => {
  // Check if the longUrl is provided and is a valid absolute URL with http or https protocol.
  if (!input.longUrl) {
    return 'longUrl is required'
  }

  try {
    // Create a new URL object to validate the longUrl.
    const url = new URL(input.longUrl)

    // Check if the protocol is either http or https.
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'longUrl must use http or https'
    }
  } catch {
    return 'longUrl must be a valid absolute URL'
  }

  // If a custom alias is provided, validate its length and allowed characters.
  if (input.customAlias !== undefined) {
    if (input.customAlias.length < 3 || input.customAlias.length > 30) {
      return 'customAlias must be between 3 and 30 characters'
    }

    if (!ALIAS_PATTERN.test(input.customAlias)) {
      return 'customAlias may only contain letters, numbers, hyphens, and underscores'
    }
  }

  // If an expiration date is provided, validate that it is a valid date and is in the future.
  if (input.expiresAt !== undefined) {
    const expiry = new Date(input.expiresAt)

    if (Number.isNaN(expiry.getTime())) {
      return 'expiresAt must be a valid date'
    }

    if (expiry <= new Date()) {
      return 'expiresAt must be in the future'
    }
  }

  return null
}

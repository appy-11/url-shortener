/**
 * Validates the input data for creating a URL.
 * @param data - The input data to validate.
 * @returns An object containing validation errors, if any.
 */
import { URL_CONFIG } from '@/config/url.config'
import type { CreateUrlPayload } from '../types/url'

/**
 * Type representing validation errors for creating a URL.
 */
export type CreateUrlErrors = Partial<Record<keyof CreateUrlPayload, string>>

const ALIAS_REGEX = /^[a-zA-Z0-9-_]+$/

export const validateCreateUrl = (data: CreateUrlPayload): CreateUrlErrors => {
  const errors: CreateUrlErrors = {}

  if (!data.url.trim()) {
    errors.url = 'URL is required'
  } else {
    try {
      const parsedUrl = new URL(data.url)

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        errors.url = 'URL must use HTTP or HTTPS'
      }
    } catch {
      errors.url = 'Please enter a valid URL'
    }
  }

  if (data.alias) {
    if (
      data.alias.length < URL_CONFIG.alias.minLength ||
      data.alias.length > URL_CONFIG.alias.maxLength
    ) {
      errors.alias = `Alias must be between ${URL_CONFIG.alias.minLength} and ${URL_CONFIG.alias.maxLength} characters`
    } else if (!ALIAS_REGEX.test(data.alias)) {
      errors.alias = 'Alias can only contain letters, numbers, hyphens and underscores'
    }
  }

  return errors
}

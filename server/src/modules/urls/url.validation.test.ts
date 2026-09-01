/**
 * Tests for the URL validation function.
 */
import { describe, expect, it } from 'vitest'

import { validateCreateUrl } from './url.validation.js'

// Test cases for the URL validation function
describe('validateCreateUrl', () => {
  // Test cases for the longUrl field
  describe('longUrl', () => {
    it('accepts a valid HTTPS URL', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
        }),
      ).toBeNull()
    })

    // Test cases for valid HTTP URLs
    it('accepts a valid HTTP URL', () => {
      expect(
        validateCreateUrl({
          longUrl: 'http://example.com',
        }),
      ).toBeNull()
    })

    // Test cases for missing or invalid longUrl
    it('rejects a missing longUrl', () => {
      expect(
        validateCreateUrl({
          longUrl: '',
        }),
      ).toBe('longUrl is required')
    })

    it('rejects an invalid URL', () => {
      expect(
        validateCreateUrl({
          longUrl: 'not-a-url',
        }),
      ).toBe('longUrl must be a valid absolute URL')
    })

    it('rejects a URL without a protocol', () => {
      expect(
        validateCreateUrl({
          longUrl: 'example.com',
        }),
      ).toBe('longUrl must be a valid absolute URL')
    })

    it('rejects unsupported protocols', () => {
      expect(
        validateCreateUrl({
          longUrl: 'ftp://example.com',
        }),
      ).toBe('longUrl must use http or https')
    })
  })

  // Test cases for the customAlias field
  describe('customAlias', () => {
    it('accepts a valid custom alias', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          customAlias: 'product-demo',
        }),
      ).toBeNull()
    })

    it('accepts aliases containing underscores', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          customAlias: 'product_demo',
        }),
      ).toBeNull()
    })

    it('accepts an alias with exactly 3 characters', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          customAlias: 'abc',
        }),
      ).toBeNull()
    })

    it('accepts an alias with exactly 30 characters', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          customAlias: 'a'.repeat(30),
        }),
      ).toBeNull()
    })

    it('rejects an alias shorter than 3 characters', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          customAlias: 'ab',
        }),
      ).toBe('customAlias must be between 3 and 30 characters')
    })

    it('rejects an alias longer than 30 characters', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          customAlias: 'a'.repeat(31),
        }),
      ).toBe('customAlias must be between 3 and 30 characters')
    })

    it('rejects spaces in an alias', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          customAlias: 'my alias',
        }),
      ).toBe('customAlias may only contain letters, numbers, hyphens, and underscores')
    })

    it('rejects special characters in an alias', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          customAlias: 'my@alias',
        }),
      ).toBe('customAlias may only contain letters, numbers, hyphens, and underscores')
    })
  })

  // Test cases for the expiresAt field
  describe('expiresAt', () => {
    it('accepts a future expiry date', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000).toISOString()

      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          expiresAt: futureDate,
        }),
      ).toBeNull()
    })

    it('rejects an invalid expiry date', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          expiresAt: 'not-a-date',
        }),
      ).toBe('expiresAt must be a valid date')
    })

    it('rejects an expiry date in the past', () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000).toISOString()

      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
          expiresAt: pastDate,
        }),
      ).toBe('expiresAt must be in the future')
    })

    it('accepts a URL without an expiry date', () => {
      expect(
        validateCreateUrl({
          longUrl: 'https://example.com',
        }),
      ).toBeNull()
    })
  })

  // Test cases for complete input
  describe('complete input', () => {
    it('accepts a valid URL with alias and expiry', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

      expect(
        validateCreateUrl({
          longUrl: 'https://example.com/some/path',
          customAlias: 'my-link',
          expiresAt: futureDate,
        }),
      ).toBeNull()
    })
  })
})

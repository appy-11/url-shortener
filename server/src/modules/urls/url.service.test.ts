/**
 * Tests for the URL service functions.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { cacheUrl, getCachedUrl } from './url.cache.js'

import {
  createUrl,
  findAllUrls,
  findUrlByIdWithClicks,
  findUrlByShortCode,
  getNextUrlId,
} from './url.repository.js'

import { createShortUrl, getUrlById, getUrls, resolveShortUrl } from './url.service.js'

import type { UrlListItem, UrlRecord } from './url.types.js'

// Mock the repository and cache functions to isolate the service layer for testing
vi.mock('./url.repository.js', () => ({
  createUrl: vi.fn(),
  findAllUrls: vi.fn(),
  findUrlByIdWithClicks: vi.fn(),
  findUrlByShortCode: vi.fn(),
  getNextUrlId: vi.fn(),
}))

vi.mock('./url.cache.js', () => ({
  cacheUrl: vi.fn(),
  getCachedUrl: vi.fn(),
}))

// Helper functions to create mock URL records for testing
const createUrlRecord = (overrides: Partial<UrlRecord> = {}): UrlRecord => ({
  id: 123n,
  shortCode: '1Z',
  originalUrl: 'https://example.com',
  expiresAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
})

// Helper function to create mock URL list items for testing
const createUrlListItem = (overrides: Partial<UrlListItem> = {}): UrlListItem => ({
  ...createUrlRecord(),
  clicks: 10,
  status: 'active',
  ...overrides,
})

// Test suite for the URL service functions
describe('url.service', () => {
  // Clear all mocks before each test to ensure isolation and prevent interference between tests
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test cases for the createShortUrl function
  describe('createShortUrl', () => {
    it('creates a URL with a Base62-generated short code', async () => {
      const id = 62n

      // Create a mock URL record with the expected short code based on the Base62 encoding of the ID
      const createdUrl = createUrlRecord({
        id,
        shortCode: '10',
      })

      // Mock the getNextUrlId and createUrl functions to return the expected values for testing
      vi.mocked(getNextUrlId).mockResolvedValue(id)
      vi.mocked(createUrl).mockResolvedValue(createdUrl)

      // Call the createShortUrl function with a valid long URL and verify that it
      // generates the correct short code and creates the URL record
      const result = await createShortUrl({
        longUrl: 'https://example.com',
      })

      // Verify that the getNextUrlId function was called once to generate the next ID
      expect(getNextUrlId).toHaveBeenCalledOnce()

      // Verify that the createUrl function was called with the expected parameters, including the generated short code
      expect(createUrl).toHaveBeenCalledWith({
        id: 62n,
        shortCode: '10',
        originalUrl: 'https://example.com',
        expiresAt: null,
      })

      // Verify that the result of the createShortUrl function matches the expected created URL record
      expect(result).toEqual(createdUrl)
    })

    // Test case for creating a URL with a custom alias
    it('uses a custom alias when provided', async () => {
      const createdUrl = createUrlRecord({
        shortCode: 'my-link',
      })

      vi.mocked(getNextUrlId).mockResolvedValue(123n)
      vi.mocked(createUrl).mockResolvedValue(createdUrl)

      const result = await createShortUrl({
        longUrl: 'https://example.com',
        customAlias: 'my-link',
      })

      expect(createUrl).toHaveBeenCalledWith({
        id: 123n,
        shortCode: 'my-link',
        originalUrl: 'https://example.com',
        expiresAt: null,
      })

      expect(result).toEqual(createdUrl)
    })

    // Test case for creating a URL with an expiry date
    it('converts expiresAt to a Date', async () => {
      const expiresAt = '2027-01-01T00:00:00.000Z'

      const createdUrl = createUrlRecord({
        expiresAt: new Date(expiresAt),
      })

      vi.mocked(getNextUrlId).mockResolvedValue(123n)
      vi.mocked(createUrl).mockResolvedValue(createdUrl)

      await createShortUrl({
        longUrl: 'https://example.com',
        expiresAt,
      })

      expect(createUrl).toHaveBeenCalledWith({
        id: 123n,
        shortCode: '1Z',
        originalUrl: 'https://example.com',
        expiresAt: new Date(expiresAt),
      })
    })

    // Test case for invalid input before accessing the repository
    it('rejects invalid input before accessing the repository', async () => {
      await expect(
        createShortUrl({
          longUrl: 'not-a-valid-url',
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        code: 'INVALID_REQUEST',
      })

      expect(getNextUrlId).not.toHaveBeenCalled()
      expect(createUrl).not.toHaveBeenCalled()
    })
  })

  // Test cases for the resolveShortUrl function
  describe('resolveShortUrl', () => {
    // Test case for retrieving a URL from Redis cache
    it('returns the URL from Redis when it is cached', async () => {
      const cachedUrl = createUrlRecord({
        shortCode: 'abc',
      })

      vi.mocked(getCachedUrl).mockResolvedValue(cachedUrl)

      const result = await resolveShortUrl('abc')

      expect(getCachedUrl).toHaveBeenCalledWith('abc')
      expect(findUrlByShortCode).not.toHaveBeenCalled()
      expect(cacheUrl).not.toHaveBeenCalled()

      expect(result).toEqual(cachedUrl)
    })

    // Test case for retrieving a URL from PostgreSQL when Redis misses
    it('returns the URL from PostgreSQL when Redis misses', async () => {
      const databaseUrl = createUrlRecord({
        shortCode: 'abc',
      })

      vi.mocked(getCachedUrl).mockResolvedValue(null)
      vi.mocked(findUrlByShortCode).mockResolvedValue(databaseUrl)
      vi.mocked(cacheUrl).mockResolvedValue(undefined)

      const result = await resolveShortUrl('abc')

      expect(getCachedUrl).toHaveBeenCalledWith('abc')
      expect(findUrlByShortCode).toHaveBeenCalledWith('abc')
      expect(cacheUrl).toHaveBeenCalledWith(databaseUrl)

      expect(result).toEqual(databaseUrl)
    })

    // Test case for handling a non-existent URL
    it('throws 404 when the URL does not exist', async () => {
      vi.mocked(getCachedUrl).mockResolvedValue(null)
      vi.mocked(findUrlByShortCode).mockResolvedValue(null)

      await expect(resolveShortUrl('missing')).rejects.toMatchObject({
        statusCode: 404,
        code: 'URL_NOT_FOUND',
      })

      expect(cacheUrl).not.toHaveBeenCalled()
    })

    // Test case for handling an expired URL in the cache
    it('throws 410 when a cached URL has expired', async () => {
      const expiredUrl = createUrlRecord({
        shortCode: 'expired',
        expiresAt: new Date(Date.now() - 60_000),
      })

      vi.mocked(getCachedUrl).mockResolvedValue(expiredUrl)

      await expect(resolveShortUrl('expired')).rejects.toMatchObject({
        statusCode: 410,
        code: 'URL_EXPIRED',
      })

      expect(findUrlByShortCode).not.toHaveBeenCalled()
    })

    // Test case for handling an expired URL in the database
    it('throws 410 when a database URL has expired', async () => {
      const expiredUrl = createUrlRecord({
        shortCode: 'expired',
        expiresAt: new Date(Date.now() - 60_000),
      })

      vi.mocked(getCachedUrl).mockResolvedValue(null)
      vi.mocked(findUrlByShortCode).mockResolvedValue(expiredUrl)

      await expect(resolveShortUrl('expired')).rejects.toMatchObject({
        statusCode: 410,
        code: 'URL_EXPIRED',
      })

      expect(cacheUrl).not.toHaveBeenCalled()
    })
  })

  // Test cases for the getUrls function
  describe('getUrls', () => {
    // Test case for retrieving all URLs from the repository
    it('returns all URLs from the repository', async () => {
      const urls = [
        createUrlListItem({
          id: 1n,
          shortCode: '1',
        }),
        createUrlListItem({
          id: 2n,
          shortCode: '2',
        }),
      ]

      vi.mocked(findAllUrls).mockResolvedValue(urls)

      const result = await getUrls()

      expect(findAllUrls).toHaveBeenCalledOnce()
      expect(result).toEqual(urls)
    })

    // Test case for handling an empty URL list
    it('returns an empty array when there are no URLs', async () => {
      vi.mocked(findAllUrls).mockResolvedValue([])

      const result = await getUrls()

      expect(result).toEqual([])
    })
  })

  // Test cases for the getUrlById function
  describe('getUrlById', () => {
    // Test case for retrieving a URL by its ID
    it('returns a URL by its ID', async () => {
      const url = createUrlListItem({
        id: 123n,
        shortCode: '1Z',
      })

      vi.mocked(findUrlByIdWithClicks).mockResolvedValue(url)

      const result = await getUrlById('123')

      expect(findUrlByIdWithClicks).toHaveBeenCalledWith(123n)
      expect(result).toEqual(url)
    })

    // Test case for handling an invalid URL ID
    it('throws 400 for an invalid URL ID', async () => {
      await expect(getUrlById('not-a-number')).rejects.toMatchObject({
        statusCode: 400,
        code: 'INVALID_URL_ID',
      })

      expect(findUrlByIdWithClicks).not.toHaveBeenCalled()
    })

    // Test case for handling a non-existent URL
    it('throws 404 when the URL does not exist', async () => {
      vi.mocked(findUrlByIdWithClicks).mockResolvedValue(null)

      await expect(getUrlById('999')).rejects.toMatchObject({
        statusCode: 404,
        code: 'URL_NOT_FOUND',
      })

      expect(findUrlByIdWithClicks).toHaveBeenCalledWith(999n)
    })
  })
})

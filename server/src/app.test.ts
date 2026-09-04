/**
 * Integration tests for the Express application.
 *
 * These tests verify that HTTP requests are correctly routed through
 * middleware and controllers and that the expected HTTP responses are
 * returned to the client.
 *
 * The underlying URL service is mocked so these tests focus on the
 * API/application layer rather than database or Redis behavior.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'

/**
 * The redirect route uses the real rate limiter middleware in the application.
 *
 * During tests, we do not want to connect to Redis just to verify that
 * Express routes and controllers work correctly. Therefore, the rate
 * limiter is mocked and simply calls next().
 *
 * This keeps the API tests isolated from external infrastructure.
 */
vi.mock('./middleware/rate-limit.middleware.js', () => ({
  createRateLimitMiddleware: vi.fn(() => {
    return (_request: unknown, _response: unknown, next: () => void) => {
      next()
    }
  }),
}))

/**
 * Import the Express application after the middleware mock is registered.
 *
 * This ensures that when app.ts imports the rate limiter, it receives
 * the mocked implementation instead of the real Redis-backed middleware.
 */
import app from './app.js'

/**
 * Import the URL service functions so their implementations can be mocked.
 *
 * The controller will call these functions during the HTTP request.
 * Mocking them allows us to control the service response without requiring
 * PostgreSQL or Redis.
 */
import {
  createShortUrl,
  getUrlById,
  getUrls,
  resolveShortUrl,
} from './modules/urls/url.service.js'

/**
 * Mock the URL service module.
 *
 * The actual service implementation is tested separately in
 * url.service.test.ts. Here we only want to verify that the HTTP layer
 * correctly handles successful service responses and errors.
 */
vi.mock('./modules/urls/url.service.js', () => ({
  createShortUrl: vi.fn(),
  getUrls: vi.fn(),
  getUrlById: vi.fn(),
  resolveShortUrl: vi.fn(),
}))

/**
 * Reset all mocks before every test.
 *
 * This prevents the result or configuration of one test from affecting
 * another test.
 */
beforeEach(() => {
  vi.clearAllMocks()
})

describe('URL API', () => {
  /**
   * Tests the POST /urls endpoint.
   *
   * The service is mocked to return a successfully created URL.
   * The test verifies that the controller returns HTTP 201 and the
   * expected response body.
   */
  it('creates a short URL', async () => {
    vi.mocked(createShortUrl).mockResolvedValue({
      id: 1n,
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      expiresAt: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    })

    const response = await request(app).post('/api/urls').send({
      longUrl: 'https://example.com',
    })

    expect(response.status).toBe(201)

    expect(response.body).toMatchObject({
      id: '1',
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      expiresAt: null,
    })

    expect(createShortUrl).toHaveBeenCalledWith({
      longUrl: 'https://example.com',
    })
  })

  /**
   * Tests the GET /urls endpoint.
   *
   * The service is mocked to return a list containing one shortened URL.
   * The test verifies that the controller returns the list with HTTP 200.
   */
  it('returns all short URLs', async () => {
    vi.mocked(getUrls).mockResolvedValue([
      {
        id: 1n,
        shortCode: 'abc123',
        originalUrl: 'https://example.com',
        expiresAt: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        clicks: 5,
        status: 'active',
      },
    ])

    const response = await request(app).get('/api/urls')

    expect(response.status).toBe(200)

    const responseBody = response.body as Array<Record<string, unknown>>

    expect(responseBody).toHaveLength(1)

    expect(responseBody[0]).toMatchObject({
      id: '1',
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      clicks: 5,
      status: 'active',
    })

    expect(getUrls).toHaveBeenCalledOnce()
  })

  /**
   * Tests the GET /urls/:id endpoint.
   *
   * The service is mocked to return a URL along with its click count
   * and current status.
   */
  it('returns a URL by ID', async () => {
    vi.mocked(getUrlById).mockResolvedValue({
      id: 1n,
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      expiresAt: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      clicks: 5,
      status: 'active',
    })

    const response = await request(app).get('/api/urls/1')

    expect(response.status).toBe(200)

    expect(response.body).toMatchObject({
      id: '1',
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      clicks: 5,
      status: 'active',
    })

    expect(getUrlById).toHaveBeenCalledWith('1')
  })

  /**
   * Tests the redirect endpoint.
   *
   * The URL service is mocked to resolve the short code to an original URL.
   * The controller should respond with HTTP 302 and the Location header
   * pointing to the original URL.
   *
   * The rate limiter is mocked, so this test does not require Redis.
   */
  it('redirects to the original URL', async () => {
    vi.mocked(resolveShortUrl).mockResolvedValue({
      id: 1n,
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      expiresAt: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    })

    const response = await request(app).get('/abc123')

    expect(response.status).toBe(302)

    expect(response.headers.location).toBe('https://example.com')

    expect(resolveShortUrl).toHaveBeenCalledWith('abc123')
  })
})

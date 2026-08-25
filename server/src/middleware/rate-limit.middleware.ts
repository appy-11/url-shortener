/**
 * Rate limiting middleware for Express.js applications.
 * This middleware uses Redis to track the number of requests made by each client IP address within a specified time window.
 * If a client exceeds the allowed number of requests, a 429 Too Many Requests error is returned.
 * The middleware also sets appropriate rate limit headers in the response to inform clients about their current usage and limits.
 */
import type { NextFunction, Request, Response } from 'express'

import { redis } from '../infrastructure/redis/client.js'
import { ApiError } from '../utils/api-error.js'

interface RateLimitOptions {
  windowSeconds: number
  maxRequests: number
  keyPrefix: string
}

/**
 * Lua script for rate limiting.
 * This script increments the request count for a given key and sets an expiration time if it's the first request.
 * It returns the current request count and the time-to-live (TTL) for the key.
 * The script is executed atomically in Redis to ensure accurate counting and expiration handling.
 */
const RATE_LIMIT_SCRIPT = `
  local current = redis.call('INCR', KEYS[1])

  if current == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
  end

  local ttl = redis.call('TTL', KEYS[1])

  return { current, ttl }
`

/**
 * Get the client's IP address from the request object.
 * This function checks the request's IP address and socket remote address to determine the client's IP.
 * If neither is available, it returns 'unknown'.
 * @param request - The Express request object.
 * @returns The client's IP address as a string.
 */
const getClientIp = (request: Request): string => {
  return request.ip || request.socket.remoteAddress || 'unknown'
}

/**
 * Create a rate limiting middleware for Express.js.
 * This function returns an Express middleware function that enforces rate limiting based on the provided options.
 * It uses Redis to track the number of requests made by each client IP address within a specified time window.
 */
export const createRateLimitMiddleware = (options: RateLimitOptions) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Get the client ip
      const clientIp = getClientIp(request)

      //generate prefix
      const key = `${options.keyPrefix}:${clientIp}`

      //run lua script
      const result = (await redis.eval(RATE_LIMIT_SCRIPT, {
        keys: [key],
        arguments: [String(options.windowSeconds)],
      })) as [number, number]

      const current = result[0]
      const ttl = result[1]

      //find remaining requests
      const remaining = Math.max(0, options.maxRequests - current)

      //set headers
      response.setHeader('X-RateLimit-Limit', options.maxRequests)

      response.setHeader('X-RateLimit-Remaining', remaining)

      response.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + ttl)

      //if request count exceeds then return too many
      if (current > options.maxRequests) {
        response.setHeader('Retry-After', ttl)

        throw new ApiError(
          429,
          'RATE_LIMIT_EXCEEDED',
          'Too many requests. Please try again later.',
        )
      }

      next()
    } catch (error) {
      if (error instanceof ApiError) {
        next(error)
        return
      }

      console.error('Rate limiter unavailable:', error)

      // Fail open if Redis is unavailable.
      next()
    }
  }
}

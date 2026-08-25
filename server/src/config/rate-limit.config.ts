/**
 * Rate limit configuration for the application.
 * This configuration defines the rate limiting rules for different endpoints in the application.
 * Each endpoint has a specified time window and a maximum number of requests allowed within that window.
 * The configuration is defined as a constant object to ensure immutability and type safety.
 */
export const RATE_LIMIT_CONFIG = {
  redirect: {
    windowSeconds: 60,
    maxRequests: 60,
  },

  createUrl: {
    windowSeconds: 60,
    maxRequests: 10,
  },
} as const

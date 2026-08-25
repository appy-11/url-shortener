/**
 *  This is the route module for handling redirect requests in the application.
 *  It defines the route for redirecting short URLs to their original URLs.
 *  The route is protected by a rate limiting middleware to prevent abuse.
 *  The router is exported for use in the main application file, where it is mounted under a specific path.
 */
import { Router } from 'express'

import { RATE_LIMIT_CONFIG } from '../../config/rate-limit.config.js'
import { createRateLimitMiddleware } from '../../middleware/rate-limit.middleware.js'

import { redirectUrlController } from '../urls/url.controller.js'

const router = Router()

// Create a rate limiting middleware for the redirect route using the configuration defined in RATE_LIMIT_CONFIG.
const redirectRateLimiter = createRateLimitMiddleware({
  ...RATE_LIMIT_CONFIG.redirect,
  keyPrefix: 'rate-limit:redirect',
})

// Define the route for redirecting short URLs to their original URLs.
// The route is protected by the redirectRateLimiter middleware to enforce rate limiting.
router.get('/:shortCode', redirectRateLimiter, redirectUrlController)

export default router

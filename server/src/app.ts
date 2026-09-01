/**
 * This is the main entry point of the application.
 * It sets up the Express server, configures middleware, and defines routes for handling requests.
 */
import express from 'express'
import cors from 'cors'

import { db } from './infrastructure/postgres/client.js'
import helmet from 'helmet'
import urlRoutes from './modules/urls/url.routes.js'
import redirectRoutes from './modules/redirect/redirect.routes.js'
import analyticsRoutes from './modules/analytics/analytics.routes.js'
import { ENV_CONFIG } from './config/env.config.js'

const app = express()
/**
 * Add security-related HTTP headers to responses.
 *
 * Helmet helps protect the application against several common
 * web security issues by setting appropriate HTTP response headers.
 */
app.use(helmet())

app.use(
  cors({
    origin: ENV_CONFIG.clientUrl,
  }),
)

/**
 * Parse JSON request bodies while limiting their size.
 *
 * The URL creation API only needs a small JSON payload, so accepting
 * very large request bodies is unnecessary and can increase the risk
 * of resource-exhaustion attacks.
 */
app.use(express.json({ limit: '10kb' }))

app.get('/health', async (_request, response, next) => {
  try {
    await db.query('SELECT 1')

    response.status(200).json({
      status: 'ok',
      database: 'connected',
    })
  } catch (error) {
    next(error)
  }
})

/**
 * Mount the URL API routes under the /api/urls path.
 *
 * This includes:
 * - POST /api/urls
 * - GET /api/urls
 * - GET /api/urls/:id
 */
app.use('/api/urls', urlRoutes)

/**
 * Mount the analytics routes under the /api/urls path.
 *
 * This exposes:
 * - GET /api/urls/:id/analytics
 */
app.use('/api/urls', analyticsRoutes)

/**
 * Mount the redirect routes at the root path.
 *
 * Short URLs are accessed directly using their short code:
 * - GET /:shortCode
 *
 * Example:
 * GET /abc123
 */
app.use('/', redirectRoutes)

export default app

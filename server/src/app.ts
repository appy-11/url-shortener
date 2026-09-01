/**
 * This is the main entry point of the application.
 * It sets up the Express server, configures middleware, and defines routes for handling requests.
 */
import express from 'express'
import cors from 'cors'

import { db } from './infrastructure/postgres/client.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import urlRoutes from './modules/urls/url.routes.js'
import redirectRoutes from './modules/redirect/redirect.routes.js'
import analyticsRoutes from './modules/analytics/analytics.routes.js'
import { ENV_CONFIG } from './config/env.config.js'

const app = express()

app.use(
  cors({
    origin: ENV_CONFIG.clientUrl,
  }),
)

app.use(express.json())

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

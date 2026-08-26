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

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
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
 * Mount the URL routes under the /api/urls path.
 * All requests to /api/urls will be handled by the urlRoutes router.
 */
app.use('/api/urls', urlRoutes)
app.use('/api/urls', analyticsRoutes)

/**
 *  Mount the URL routes under the /api/path
 *  All requests to /api/ will be handled by the redirectRoutes router.
 */
app.use('/', redirectRoutes)

/**
 * Error handling middleware.
 * This middleware catches any errors thrown in the application and sends an appropriate response to the client.
 * It should be placed after all other middleware and routes.
 */
app.use(errorMiddleware)

export default app

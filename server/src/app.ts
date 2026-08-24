/**
 * This module sets up an Express application with middleware for handling CORS, JSON parsing, and error handling.
 * It also defines a health check endpoint that verifies the application's ability to connect to the PostgreSQL database.
 * The application is configured to allow requests from a specified client URL, which can be set via an environment variable.
 * The Express application instance is exported for use in other parts of the application, such as the server entry point.
 */
import express from 'express'
import cors from 'cors'
import { db } from './infrastructure/postgres/client.js'
import { errorMiddleware } from './middleware/error.middleware.js'

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  }),
)

app.use(express.json())

// app.get('/health', (_request, response) => {
//   response.status(200).json({
//     status: 'ok',
//   })
// })

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

app.use(errorMiddleware)

export default app

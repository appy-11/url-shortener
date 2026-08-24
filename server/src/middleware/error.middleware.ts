/**
 * This middleware handles errors that occur during the processing of requests in the Express application.
 * It logs the error to the console and sends a standardized JSON response with a 500 status code,
 * indicating an internal server error. The response includes an error code and a generic message.
 * This middleware should be placed after all other middleware and route handlers to catch any unhandled errors.
 */
import type { ErrorRequestHandler } from 'express'

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.error(error)

  response.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong.',
  })
}

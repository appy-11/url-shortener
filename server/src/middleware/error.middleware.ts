/**
 * This middleware handles errors that occur during the processing of requests in the Express application.
 * It logs the error to the console and sends a standardized JSON response.
 *
 * Known ApiError instances preserve their HTTP status code and application
 * error code, while unexpected errors are converted into a generic 500
 * response so internal implementation details are not exposed to clients.
 *
 * This middleware should be placed after all other middleware and route
 * handlers to catch any unhandled errors.
 */
import type { ErrorRequestHandler } from 'express'

import { ApiError } from '../utils/api-error.js'

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  // Log the complete error on the server for debugging and monitoring.
  console.error(error)
  const errorValue: unknown = error
  void _next

  /**
   * Handle application-specific errors.
   *
   * ApiError contains the HTTP status code, application error code,
   * and safe message that can be returned to the client.
   */
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    })

    return
  }

  /**
   * Handle malformed JSON request bodies.
   *
   * Express/body-parser identifies malformed JSON errors using the
   * `entity.parse.failed` error type. These are client-side errors,
   * so they should return HTTP 400 rather than HTTP 500.
   */
  if (
    typeof errorValue === 'object' &&
    errorValue !== null &&
    'type' in errorValue &&
    errorValue.type === 'entity.parse.failed'
  ) {
    response.status(400).json({
      error: 'INVALID_JSON',
      message: 'The request body contains invalid JSON.',
    })

    return
  }

  /**
   * Handle unexpected errors.
   *
   * Do not expose the original error message because it could contain
   * sensitive implementation details such as database errors,
   * filesystem paths, or internal service information.
   */
  response.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong.',
  })
}

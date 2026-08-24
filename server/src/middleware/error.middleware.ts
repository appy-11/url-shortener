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

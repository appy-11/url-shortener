/**
 * This module defines TypeScript types and classes related to API error handling.
 * It includes the `ApiErrorResponse` interface, which represents the structure of an API error response,
 * and the `ApiError` class, which extends the built-in `Error` class to provide additional properties
 * for handling API errors, such as `status` and `code`.
 * The `ApiError` class can be used to throw and catch API-related errors in a consistent manner throughout the application.
 */
export interface ApiErrorResponse {
  message: string
  code?: string
  status?: number
}

export class ApiError extends Error {
  readonly status?: number
  readonly code?: string

  constructor({ message, status, code }: ApiErrorResponse) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

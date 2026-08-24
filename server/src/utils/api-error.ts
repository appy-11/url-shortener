/**
 * This class represents a custom error type for API errors in the application.
 * It extends the built-in Error class and includes additional properties for
 * the HTTP status code and a custom error code. This allows for more structured
 * error handling and response formatting in the API.
 */
export class ApiError extends Error {
  statusCode: number
  code: string

  constructor(statusCode: number, code: string, message: string) {
    super(message)

    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
  }
}

/**
 * This module provides a client for making API requests to the backend server.
 *
 * It provides helper methods for common HTTP operations (GET, POST, PATCH, DELETE)
 * and uses the Fetch API to communicate with the backend.
 *
 * The client also handles query parameters, request headers, JSON responses,
 * and API errors by converting unsuccessful responses into ApiError instances.
 */

import { APP_CONFIG } from '../config/app.config'
import { ApiError } from '../types/api'

/**
 * Options supported by the API client.
 *
 * Extends the native Fetch API RequestInit options with optional
 * query parameters.
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * Represents the expected structure of an API error response.
 */
interface ErrorResponse {
  message?: string
  code?: string
}

/**
 * Checks whether an unknown value matches the expected API error response shape.
 *
 * @param value - The value to validate.
 * @returns True when the value is a valid ErrorResponse object.
 */
const isErrorResponse = (value: unknown): value is ErrorResponse => {
  // Ensure the value is a non-null object before accessing its properties.
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const body = value as Record<string, unknown>

  // Validate that message and code, when present, are strings.
  return (
    (body.message === undefined || typeof body.message === 'string') &&
    (body.code === undefined || typeof body.code === 'string')
  )
}

/**
 * Builds the complete API URL and appends query parameters when provided.
 *
 * @param path - The API endpoint path.
 * @param params - Optional query parameters.
 * @returns The fully constructed URL.
 */
const buildUrl = (path: string, params?: RequestOptions['params']) => {
  const url = new URL(`${APP_CONFIG.apiBaseUrl}${path}`, window.location.origin)

  // Add defined query parameters to the URL.
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

/**
 * Shared API client for communicating with the backend.
 *
 * Provides a generic request method and convenience methods for
 * GET, POST, PATCH, and DELETE requests.
 */
export const apiClient = {
  /**
   * Sends an HTTP request to the backend API.
   *
   * @param path - The API endpoint path.
   * @param options - Request configuration including method, body, headers, and query parameters.
   * @returns The parsed API response.
   * @throws ApiError - When the API returns a non-successful response.
   */
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...requestOptions } = options

    // Send the request using the Fetch API.
    const response = await fetch(buildUrl(path, params), {
      ...requestOptions,
      headers: {
        // Send JSON by default while allowing custom headers to override it.
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    // Handle unsuccessful HTTP responses.
    if (!response.ok) {
      let errorBody: ErrorResponse = {}

      try {
        // Parse the response body when it contains JSON.
        const parsedBody: unknown = await response.json()

        // Only use the parsed body when it matches the expected error shape.
        if (isErrorResponse(parsedBody)) {
          errorBody = parsedBody
        }
      } catch {
        // Response may not contain JSON.
      }

      // Convert the failed HTTP response into a consistent ApiError.
      throw new ApiError({
        message: errorBody.message ?? 'Something went wrong. Please try again.',
        status: response.status,
        code: errorBody.code,
      })
    }

    // Return undefined for successful requests with no response body.
    if (response.status === 204) {
      return undefined as T
    }

    // Parse and return the successful JSON response.
    const data: unknown = await response.json()

    return data as T
  },

  /**
   * Sends a GET request.
   *
   * @param path - The API endpoint path.
   * @param params - Optional query parameters.
   * @returns The parsed API response.
   */
  get<T>(path: string, params?: RequestOptions['params']) {
    return apiClient.request<T>(path, {
      method: 'GET',
      params,
    })
  },

  /**
   * Sends a POST request.
   *
   * @param path - The API endpoint path.
   * @param body - Optional request body.
   * @returns The parsed API response.
   */
  post<T>(path: string, body?: unknown) {
    return apiClient.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  /**
   * Sends a PATCH request.
   *
   * @param path - The API endpoint path.
   * @param body - Optional request body.
   * @returns The parsed API response.
   */
  patch<T>(path: string, body?: unknown) {
    return apiClient.request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  /**
   * Sends a DELETE request.
   *
   * @param path - The API endpoint path.
   * @returns The parsed API response.
   */
  delete<T>(path: string) {
    return apiClient.request<T>(path, {
      method: 'DELETE',
    })
  },
}

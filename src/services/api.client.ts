/**
 * This module provides a client for making API requests to the backend server.
 * It includes functions for sending HTTP requests (GET, POST, PATCH, DELETE) and handling responses.
 * The client automatically handles query parameters, request headers, and error responses.
 * It uses the Fetch API to perform network requests and provides a consistent interface for interacting with the backend API.
 * The client also includes error handling logic to throw custom ApiError instances for non-successful responses.
 */
import { APP_CONFIG } from '../config/app.config'
import { ApiError } from '../types/api'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

interface ErrorResponse {
  message?: string
  code?: string
}

const isErrorResponse = (value: unknown): value is ErrorResponse => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const body = value as Record<string, unknown>

  return (
    (body.message === undefined || typeof body.message === 'string') &&
    (body.code === undefined || typeof body.code === 'string')
  )
}

const buildUrl = (path: string, params?: RequestOptions['params']) => {
  const url = new URL(`${APP_CONFIG.apiBaseUrl}${path}`, window.location.origin)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

export const apiClient = {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...requestOptions } = options

    const response = await fetch(buildUrl(path, params), {
      ...requestOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    if (!response.ok) {
      let errorBody: ErrorResponse = {}

      try {
        const parsedBody: unknown = await response.json()

        if (isErrorResponse(parsedBody)) {
          errorBody = parsedBody
        }
      } catch {
        // Response may not contain JSON.
      }

      throw new ApiError({
        message: errorBody.message ?? 'Something went wrong. Please try again.',
        status: response.status,
        code: errorBody.code,
      })
    }

    if (response.status === 204) {
      return undefined as T
    }

    const data: unknown = await response.json()

    return data as T
  },

  get<T>(path: string, params?: RequestOptions['params']) {
    return apiClient.request<T>(path, {
      method: 'GET',
      params,
    })
  },

  post<T>(path: string, body?: unknown) {
    return apiClient.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  patch<T>(path: string, body?: unknown) {
    return apiClient.request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(path: string) {
    return apiClient.request<T>(path, {
      method: 'DELETE',
    })
  },
}

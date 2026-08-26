/**
 * Controller for retrieving analytics data for a shortened URL.
 *
 * Fetches the URL details and click history from the analytics service
 * and returns them in the API response format.
 */

import type { NextFunction, Request, Response } from 'express'

import { getUrlAnalytics } from './analytics.service.js'

// Handles requests for analytics data for a specific shortened URL.
export const getUrlAnalyticsController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // Extract the URL ID from the route parameters.
    const { id } = request.params

    // Retrieve the URL details and click history.
    const analytics = await getUrlAnalytics(id as string)

    // Return the analytics data in a structured API response.
    response.json({
      url: {
        // Convert BigInt to string because JSON does not support BigInt.
        id: analytics.url.id.toString(),

        shortCode: analytics.url.shortCode,
        originalUrl: analytics.url.originalUrl,
        expiresAt: analytics.url.expiresAt,
        createdAt: analytics.url.createdAt,
        updatedAt: analytics.url.updatedAt,
        clicks: analytics.url.clicks,
        status: analytics.url.status,
      },

      // Return daily click history for the URL.
      clickHistory: analytics.clickHistory,
    })
  } catch (error) {
    // Pass errors to Express's centralized error-handling middleware.
    next(error)
  }
}

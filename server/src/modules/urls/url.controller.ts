/**
 * This module defines the controller for handling URL-related requests in the application.
 * It provides an endpoint for creating short URLs based on user input.
 * The controller validates the input, interacts with the URL service, and sends appropriate responses to the client.
 */
import type { Request, Response, NextFunction } from 'express'
import { APP_CONFIG } from '../../config/app.config.js'
import { createShortUrl, getUrlById, getUrls, resolveShortUrl } from './url.service.js'

import type { CreateUrlInput } from './url.types.js'
import { recordClickAsync } from '../analytics/analytics.service.js'

/**
 * Creates a new short URL based on the provided input.
 */
export const createUrlController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // Extract the input data from the request body and cast it to the CreateUrlInput type.
    const input = request.body as CreateUrlInput

    // Call the service function to create a short URL.
    const url = await createShortUrl(input)

    // Respond with a 201 status code and the details of the created short URL.
    response.status(201).json({
      id: url.id.toString(),
      shortUrl: `https://${APP_CONFIG.shortUrlDomain}/${url.shortCode}`,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Redirects the user to the original URL based on the provided short code.
 */
export const redirectUrlController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // Extract the short code from the request parameters.
    const { shortCode } = request.params

    // Call the service function to resolve the short URL to its original URL.
    const url = await resolveShortUrl(shortCode as string)

    // add the click event to the analytics
    // the idea is to make sure that the redirect doesnt wait for the analytics worker
    // point to note here:What if Node crashes immediately after response.redirect() but before the queue request reaches Redis?
    // That click could be lost.
    // since analytics are not that important here, I m keeping it as it is.
    // If the analytics are important then I need to transactional outbox
    void recordClickAsync(url.id).catch((error) => {
      console.error('Failed to queue analytics event:', error)
    })

    // Redirect the user to the original URL with a 302 status code.
    response.redirect(302, url.originalUrl)
  } catch (error) {
    next(error)
  }
}

/**
 * Controller for retrieving all shortened URLs.
 *
 * Fetches URL data from the service layer, formats the response for the API,
 * and determines whether each URL is currently active or expired.
 */

export const getUrlsController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // Fetch all URLs along with their click counts.
    const urls = await getUrls()

    // Transform the service response into the API response format.
    response.json(
      urls.map((url) => ({
        // Convert the BigInt ID to a string because JSON does not support BigInt.
        id: url.id.toString(),

        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
        clicks: url.clicks,

        // A URL is expired when it has an expiry date in the past.
        // URLs without an expiry date remain active.
        status: url.expiresAt && url.expiresAt <= new Date() ? 'expired' : 'active',
      })),
    )
  } catch (error) {
    // Pass errors to Express's centralized error-handling middleware.
    next(error)
  }
}

/**
 * Retrieves a shortened URL by its database ID.
 */
export const getUrlByIdController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { id } = request.params

    const url = await getUrlById(id as string)

    response.status(200).json({
      id: url.id.toString(),
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      clicks: url.clicks,
      status: url.status,
    })
  } catch (error) {
    next(error)
  }
}

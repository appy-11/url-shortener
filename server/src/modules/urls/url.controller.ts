/**
 * This module defines the controller for handling URL-related requests in the application.
 * It provides an endpoint for creating short URLs based on user input.
 * The controller validates the input, interacts with the URL service, and sends appropriate responses to the client.
 */
import type { Request, Response, NextFunction } from 'express'

import { createShortUrl, UrlValidationError } from './url.service.js'

import type { CreateUrlInput } from './url.types.js'

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
      shortUrl: `https://short.ly/${url.shortCode}`,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    })
  } catch (error) {
    // If the error is an instance of UrlValidationError, respond with a 400 status code and the error message.
    if (error instanceof UrlValidationError) {
      response.status(400).json({
        error: 'INVALID_REQUEST',
        message: error.message,
      })

      return
    }

    next(error)
  }
}

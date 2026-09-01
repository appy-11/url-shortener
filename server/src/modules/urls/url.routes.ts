/**
 * This module defines the routes for handling URL-related API requests.
 *
 * The router maps HTTP methods and paths to the corresponding controllers.
 * It is mounted under the /api/urls path by the main Express application.
 */
import { Router } from 'express'

import {
  createUrlController,
  getUrlByIdController,
  getUrlsController,
} from './url.controller.js'

const router = Router()

/**
 * Creates a new shortened URL.
 *
 * POST /api/urls
 */
router.post('/', createUrlController)

/**
 * Retrieves all shortened URLs.
 *
 * GET /api/urls
 */
router.get('/', getUrlsController)

/**
 * Retrieves a shortened URL by its database ID.
 *
 * GET /api/urls/:id
 */
router.get('/:id', getUrlByIdController)

export default router

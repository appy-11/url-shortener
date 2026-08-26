/**
 * This module defines the routes for handling URL-related requests in the application.
 * It sets up the Express router and maps HTTP methods and paths to the corresponding controller functions.
 * The router is exported for use in the main application file, where it is mounted under a specific path.
 */
import { Router } from 'express'

import { createUrlController, getUrlsController } from './url.controller.js'

const router = Router()

router.post('/', createUrlController)

router.get('/', getUrlsController)

export default router

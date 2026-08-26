/**
 * This file defines the routes for URL analytics.
 *
 * The analytics endpoint retrieves click statistics and click history
 * for a specific shortened URL.
 */

import { Router } from 'express'

import { getUrlAnalyticsController } from './analytics.controller.js'

const router = Router()

// Get analytics data for a specific shortened URL.
router.get('/:id/analytics', getUrlAnalyticsController)

export default router

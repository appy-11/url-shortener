/**
 * Clears all jobs from the analytics queue.
 *
 * This script is intended for local development only.
 * It removes waiting, active, completed, and failed jobs
 * from the BullMQ analytics queue.
 */

import 'dotenv/config'

import { analyticsQueue } from '../../modules/analytics/analytics.queue.js'

const clearAnalyticsQueue = async () => {
  try {
    // Remove all jobs and queue data from Redis.
    await analyticsQueue.obliterate({ force: true })

    console.log('Analytics queue cleared successfully.')
  } catch (error) {
    console.error('Failed to clear analytics queue:', error)
    process.exitCode = 1
  } finally {
    // Close the BullMQ queue connection cleanly.
    await analyticsQueue.close()
  }
}

void clearAnalyticsQueue()

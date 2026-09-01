/**
 * Clears all jobs from the analytics queue.
 *
 * This is intended for local development only.
 * It removes waiting, active, completed, and failed analytics jobs.
 */

import 'dotenv/config'

import { analyticsQueue } from '../../modules/analytics/analytics.queue.js'

const clearAnalyticsQueue = async () => {
  // Remove all jobs from the analytics queue.
  await analyticsQueue.obliterate({ force: true })

  console.log('Analytics queue cleared.')

  // Close the queue connection cleanly.
  await analyticsQueue.close()
}

void clearAnalyticsQueue()

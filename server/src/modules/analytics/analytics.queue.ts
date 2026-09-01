/**
 * This file defines the analytics queue and the job payload used
 * to process URL click events asynchronously through BullMQ.
 */

import { Queue } from 'bullmq'

import { queueConnection } from '../../infrastructure/queue/connection.js'

// Name of the BullMQ queue used to process URL analytics events.
export const ANALYTICS_QUEUE_NAME = 'analytics'

// Payload structure for a URL click analytics job.
export interface ClickEventJob {
  // ID of the shortened URL that was clicked.
  urlId: string

  // Timestamp indicating when the click occurred.
  clickedAt: string
}

// Create the analytics queue using the shared Redis connection.
export const analyticsQueue = new Queue<ClickEventJob>(ANALYTICS_QUEUE_NAME, {
  connection: queueConnection,

  /**
   * Default options applied to jobs added to this queue.
   */
  defaultJobOptions: {
    /**
     * Retry failed jobs up to 3 times.
     *
     * This is useful for temporary failures such as:
     * - PostgreSQL being temporarily unavailable
     * - Redis/network interruptions
     * - transient infrastructure errors
     *
     * The initial attempt is not counted as a retry,
     * so a job can be processed up to 4 times in total.
     */
    attempts: 3,

    /**
     * Wait progressively longer between retry attempts.
     *
     * With exponential backoff, the delay increases after
     * each failed attempt instead of retrying immediately.
     */
    backoff: {
      type: 'exponential',
      delay: 1000,
    },

    /**
     * Remove successfully completed jobs from Redis.
     *
     * Analytics jobs do not need to remain in Redis after
     * they have been successfully persisted to PostgreSQL.
     */
    removeOnComplete: true,

    /**
     * Keep failed jobs in Redis so they can be inspected
     * and diagnosed if all retry attempts fail.
     */
    removeOnFail: false,
  },
})

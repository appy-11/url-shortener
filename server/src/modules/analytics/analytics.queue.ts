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
})

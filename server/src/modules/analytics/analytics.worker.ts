/**
 * This file defines the analytics worker responsible for processing
 * URL click events from the analytics queue.
 *
 * The worker receives queued click events and persists them to PostgreSQL.
 */

import { Worker } from 'bullmq'

import { ANALYTICS_QUEUE_NAME, type ClickEventJob } from './analytics.queue.js'

import { createClickEvent } from './analytics.repository.js'

import { queueConnection } from '../../infrastructure/queue/connection.js'

// Create a worker that listens to the analytics queue and processes click events.
export const analyticsWorker = new Worker<ClickEventJob>(
  ANALYTICS_QUEUE_NAME,
  async (job) => {
    // Extract the URL ID and click timestamp from the queued job.
    const { urlId, clickedAt } = job.data

    // Convert the serialized values back to their appropriate types
    // before storing the click event in PostgreSQL.
    await createClickEvent(BigInt(urlId), new Date(clickedAt))
  },
  {
    // Use the shared Redis connection to communicate with BullMQ.
    connection: queueConnection,
  },
)

// Log a message when an analytics job has been processed successfully.
analyticsWorker.on('completed', (job) => {
  console.log(`Analytics job completed: ${job.id}`)
})

// Log the job and error details when processing fails.
// Failed jobs are retained because removeOnFail is disabled in the queue.
analyticsWorker.on('failed', (job, error) => {
  console.error(`Analytics job failed: ${job?.id}`, error)
})

// Handle errors emitted by the worker itself, such as Redis connection errors.
analyticsWorker.on('error', (error) => {
  console.error('Analytics worker error:', error)
})

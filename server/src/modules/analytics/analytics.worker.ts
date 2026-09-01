/**
 * This file defines the analytics worker responsible for processing
 * URL click events from the analytics queue.
 *
 * The worker receives queued click events and persists them to PostgreSQL.
 */

import { Worker } from 'bullmq'

import { ANALYTICS_QUEUE_NAME, type ClickEventJob } from './analytics.queue.js'

import { createClickEvent, UrlNotFoundError } from './analytics.repository.js'

import { queueConnection } from '../../infrastructure/queue/connection.js'

/**
 * Processes a single analytics job.
 *
 * The values inside the BullMQ job are serialized values, so the URL ID
 * and click timestamp need to be converted back into their appropriate
 * JavaScript types before being passed to the repository.
 *
 * Keeping this logic separate from the Worker instance also makes it
 * possible to test the processing logic without starting a Redis worker.
 */
export const processAnalyticsJob = async (job: {
  data: ClickEventJob
}): Promise<void> => {
  // Extract the URL ID and click timestamp from the queued job.
  const { urlId, clickedAt } = job.data

  try {
    // Convert the serialized values back to their appropriate types
    // before storing the click event in PostgreSQL.
    await createClickEvent(BigInt(urlId), new Date(clickedAt))
  } catch (error) {
    /**
     * A missing URL is a permanent failure.
     *
     * Retrying the job cannot fix the problem because the referenced
     * URL does not exist in the database.
     */
    if (error instanceof UrlNotFoundError) {
      console.error(error.message)

      // Do not re-throw the error. This prevents BullMQ from retrying
      // a job that can never succeed.
      return
    }

    /**
     * All other errors are potentially transient.
     *
     * Re-throwing the error allows BullMQ's retry and exponential
     * backoff configuration to handle the failure.
     */
    throw error
  }
}

// Create a worker that listens to the analytics queue and processes click events.
export const analyticsWorker = new Worker<ClickEventJob>(
  ANALYTICS_QUEUE_NAME,
  processAnalyticsJob,
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

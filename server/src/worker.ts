/**
 * Entry point for the analytics worker process.
 *
 * This file loads environment variables, initializes the analytics
 * worker, and handles graceful shutdown when the process is stopped.
 */

// Load environment variables from the .env file.
import 'dotenv/config'

import { analyticsWorker } from './modules/analytics/analytics.worker.js'

// Confirm that the analytics worker process has started successfully.
console.log('Analytics worker started')

/**
 * Gracefully shuts down the analytics worker.
 *
 * Closing the worker allows currently running jobs to finish before
 * the worker stops accepting new jobs.
 */
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down analytics worker...`)

  try {
    // Close the BullMQ worker gracefully.
    await analyticsWorker.close()

    console.log('Analytics worker shut down gracefully.')

    process.exit(0)
  } catch (error) {
    console.error('Error during analytics worker shutdown:', error)

    process.exit(1)
  }
}

// Handle Ctrl+C and termination signals.
process.on('SIGINT', () => {
  void shutdown('SIGINT')
})

process.on('SIGTERM', () => {
  void shutdown('SIGTERM')
})

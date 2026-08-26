/**
 * Entry point for the analytics worker process.
 *
 * This file loads environment variables, initializes the analytics
 * worker, and logs a message to confirm that the worker has started.
 */

// Load environment variables from the .env file.
import 'dotenv/config'

// Initialize the analytics worker.
import './modules/analytics/analytics.worker.js'

// Confirm that the analytics worker process has started successfully.
console.log('Analytics worker started')

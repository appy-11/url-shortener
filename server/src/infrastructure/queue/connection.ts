/**
 * This module provides the Redis connection used by BullMQ.
 *
 * The connection is shared by the analytics queue and worker.
 */

import { Redis } from 'ioredis'

import { ENV_CONFIG } from '../../config/env.config.js'

// Redis connection URL is provided by the centralized environment configuration.
const redisUrl = ENV_CONFIG.redisUrl

// Create a shared Redis connection for the application's queues.
//
// maxRetriesPerRequest is disabled because BullMQ requires commands
// to remain pending instead of failing after a fixed number of retries.
export const queueConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
})

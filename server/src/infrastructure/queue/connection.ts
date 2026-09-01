/**
 * This module provides the Redis connection used by BullMQ.
 *
 * The connection is shared by the analytics queue and worker.
 */

import { Redis } from 'ioredis'

// Redis connection URL, configurable through the environment.
// Falls back to the local Redis instance during development.
const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379'

// Create a shared Redis connection for the application's queues.
//
// maxRetriesPerRequest is disabled because BullMQ requires commands
// to remain pending instead of failing after a fixed number of retries.
export const queueConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
})

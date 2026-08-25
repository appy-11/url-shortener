/**
 * This file is responsible for creating and exporting a Redis client instance using the `redis` package.
 * The client connects to a Redis server specified by the `REDIS_URL` environment variable,
 * or defaults to `redis://localhost:6379` if the variable is not set.
 * The client also listens for error events and logs them to the console.
 * Don't want every module creating its own Redis connection.
 * There should be one shared Redis client.
 */
import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379'

export const redis = createClient({
  url: redisUrl,
})

redis.on('error', (error) => {
  console.error('Redis Client Error', error)
})

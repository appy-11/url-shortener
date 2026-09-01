/**
 * This is the main entry point of the application.
 * It sets up the Express server, configures middleware, and defines routes for handling requests.
 *
 * The node app starts up and connects to the Redis server before
 * listening for incoming requests on the specified port.
 *
 * The server also handles graceful shutdown so that active connections
 * are closed cleanly when the process receives a termination signal.
 */
import 'dotenv/config'

import type { Server } from 'node:http'

import app from './app.js'
import { APP_CONFIG } from './config/app.config.js'
import { db } from './infrastructure/postgres/client.js'
import { redis } from './infrastructure/redis/client.js'

const port = Number(process.env.PORT ?? 3000)

let server: Server | undefined

const startServer = async () => {
  // Verify that PostgreSQL is available before accepting requests.
  await db.query('SELECT 1')

  // Connect to Redis before accepting requests.
  await redis.connect()

  server = app.listen(port, () => {
    console.log(`${APP_CONFIG.name} running on port ${APP_CONFIG.port}`)
  })
}

/**
 * Gracefully shuts down the API server and its infrastructure connections.
 *
 * The shutdown sequence is:
 *
 * 1. Stop accepting new HTTP requests.
 * 2. Close the Redis client used by the API.
 * 3. Close the PostgreSQL connection pool.
 * 4. Exit the process.
 */
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`)

  try {
    // Store the server reference locally so TypeScript knows
    // it cannot become undefined inside the callback.
    const currentServer = server

    // Stop accepting new HTTP connections.
    if (currentServer) {
      await new Promise<void>((resolve, reject) => {
        currentServer.close((error) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        })
      })
    }

    // Close the application's Redis connection.
    if (redis.isOpen) {
      await redis.quit()
    }

    // Close all PostgreSQL connections in the pool.
    await db.end()

    console.log('API server shut down gracefully.')

    process.exit(0)
  } catch (error) {
    console.error('Error during server shutdown:', error)

    process.exit(1)
  }
}

// Handle the termination signals normally sent when the application stops.
process.on('SIGINT', () => {
  void shutdown('SIGINT')
})

process.on('SIGTERM', () => {
  void shutdown('SIGTERM')
})

void startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

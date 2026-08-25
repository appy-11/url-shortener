/**
 * This is the main entry point of the application.
 * It sets up the Express server, configures middleware, and defines routes for handling requests.
 * The node app starts up and connects to the Postgres database and the Redis server before
 * listening for incoming requests on the specified port.
 */
import 'dotenv/config'

import app from './app.js'
import { APP_CONFIG } from './config/app.config.js'
import { redis } from './infrastructure/redis/client.js'

const port = Number(process.env.PORT ?? 3000)

const startServer = async () => {
  await redis.connect()

  app.listen(port, () => {
    console.log(`${APP_CONFIG.name} running on port ${APP_CONFIG.port}`)
  })
}

void startServer()

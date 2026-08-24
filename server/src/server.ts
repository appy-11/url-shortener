/**
 * This is the entry point of the server application. It imports the necessary modules,
 * including the Express application instance and configuration settings.
 * The server listens on the specified port defined in the application configuration and
 * logs a message indicating that it is running.
 * Environment variables are loaded using the `dotenv` package to ensure that configuration
 * settings are available at runtime.
 */
import 'dotenv/config'

import app from './app.js'
import { APP_CONFIG } from './config/app.config.js'

app.listen(APP_CONFIG.port, () => {
  console.log(`${APP_CONFIG.name} running on port ${APP_CONFIG.port}`)
})

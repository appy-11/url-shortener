/**
 * This module defines the application configuration for the server.
 * It reads the application name, port, and environment from environment variables.
 * If the PORT environment variable is not set or is not a valid number, an error is thrown to prevent the application from starting with an invalid configuration.
 * The configuration object is exported as a constant for use in other parts of the application,
 * such as the server entry point.
 */
const port = Number(process.env.PORT ?? 3000)

if (Number.isNaN(port)) {
  throw new Error('PORT must be a valid number')
}

export const APP_CONFIG = {
  name: 'Shortly API',
  port,
  nodeEnv: process.env.NODE_ENV ?? 'development',
} as const

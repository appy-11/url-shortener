/**
 * This module validates and exposes environment variables used by
 * the backend application.
 *
 * Keeping environment access in one place prevents different modules
 * from reading process.env independently and makes configuration
 * failures visible when the application starts.
 */

import 'dotenv/config'

/**
 * Reads a required environment variable.
 *
 * An error is thrown immediately when the variable is missing or empty.
 */
const getRequiredEnv = (name: string): string => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}

/**
 * Reads an environment variable as a positive integer.
 *
 * A default value can be provided for development configuration.
 */
const getPositiveIntegerEnv = (name: string, defaultValue: number): number => {
  const value = process.env[name]

  if (value === undefined) {
    return defaultValue
  }

  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${name} must be a positive integer`)
  }

  return parsedValue
}

export const ENV_CONFIG = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  port: getPositiveIntegerEnv('PORT', 3000),

  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',

  databaseUrl: getRequiredEnv('DATABASE_URL'),

  dbPoolMax: getPositiveIntegerEnv('DB_POOL_MAX', 10),

  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',

  shortUrlDomain: process.env.SHORT_URL_DOMAIN ?? 'short.ly',
} as const

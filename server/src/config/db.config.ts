/**
 * This module defines the database configuration for the application.
 * It reads the database connection string and maximum pool size from environment variables.
 * If the DATABASE_URL environment variable is not set, an error is thrown to prevent the application from starting without a valid database configuration.
 * The configuration object is exported as a constant for use in other parts of the application,
 * such as the PostgreSQL client setup.
 */
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not configured')
}

export const DB_CONFIG = {
  connectionString: databaseUrl,
  maxConnections: Number(process.env.DB_POOL_MAX ?? 10),
} as const

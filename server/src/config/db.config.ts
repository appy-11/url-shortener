/**
 * This module defines the database configuration for the application.
 * It reads the database configuration from the centralized environment
 * configuration and exposes the settings used by the PostgreSQL client.
 */

import { ENV_CONFIG } from './env.config.js'

export const DB_CONFIG = {
  connectionString: ENV_CONFIG.databaseUrl,
  maxConnections: ENV_CONFIG.dbPoolMax,
} as const

/**
 * This module defines the application configuration for the server.
 * It reads the application configuration from the centralized environment
 * configuration to ensure consistent configuration across the application.
 */

import { ENV_CONFIG } from './env.config.js'

export const APP_CONFIG = {
  name: 'Shortly API',
  port: ENV_CONFIG.port,
  nodeEnv: ENV_CONFIG.nodeEnv,
  shortUrlDomain: ENV_CONFIG.shortUrlDomain,
} as const

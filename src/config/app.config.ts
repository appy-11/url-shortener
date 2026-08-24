/**
 * Application configuration constants.
 * These constants are used throughout the application
 * for consistent references to the app's identity and URL structure.
 */

export const APP_CONFIG = {
  name: 'Shortly',

  shortUrlDomain: import.meta.env.VITE_SHORT_URL_DOMAIN ?? 'short.ly',

  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
} as const

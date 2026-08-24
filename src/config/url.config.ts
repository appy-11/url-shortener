/**
 * URL configuration for the application.
 * This configuration includes settings for alias length and expiry options for short URLs.
 * These constants are used throughout the application to enforce consistent rules and options for URL creation.
 */

import type { ExpiryOption } from '../types/url'

interface UrlConfig {
  expiryOptions: readonly {
    label: string
    value: ExpiryOption
  }[]
  alias: {
    minLength: number
    maxLength: number
  }
  statusFilters: readonly {
    label: string
    value: 'all' | 'active' | 'expired'
  }[]
}

export const URL_CONFIG: UrlConfig = {
  expiryOptions: [
    {
      label: 'Never',
      value: 'never',
    },
    {
      label: '1 Hour',
      value: '1h',
    },
    {
      label: '1 Day',
      value: '1d',
    },
    {
      label: '7 Days',
      value: '7d',
    },
    {
      label: '30 Days',
      value: '30d',
    },
  ],
  statusFilters: [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Expired',
      value: 'expired',
    },
  ],

  alias: {
    minLength: 3,
    maxLength: 30,
  },
}

/**
 * URL configuration for the application.
 * This configuration includes settings for alias length and expiry options for short URLs.
 * These constants are used throughout the application to enforce consistent rules and options for URL creation.
 */
export const URL_CONFIG = {
  alias: {
    minLength: 3,
    maxLength: 30,
  },

  expiryOptions: [
    {
      label: "Never",
      value: "never",
    },
    {
      label: "1 hour",
      value: "1h",
    },
    {
      label: "1 day",
      value: "1d",
    },
    {
      label: "7 days",
      value: "7d",
    },
    {
      label: "30 days",
      value: "30d",
    },
    {
      label: "Custom",
      value: "custom",
    },
  ],

  statusFilters: [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Expired",
      value: "expired",
    },
  ],
} as const;
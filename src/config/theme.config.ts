/**
 * This file contains configuration settings related to the application's theme,
 *  including the storage key for theme preference and the default theme setting.
 */
export const THEME_CONFIG = {
  storageKey: 'shortly-theme',
} as const

export type Theme = 'light' | 'dark'

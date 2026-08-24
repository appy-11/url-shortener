/**
 * This file contains a custom React hook for managing the application's theme.
 * It provides functionality to get and set the current theme, as well as to apply the theme to the document.
 * The hook uses localStorage to persist the user's theme preference and
 * respects the system's color scheme when the 'system' theme is selected.
 */
import { useEffect, useState } from 'react'

import { THEME_CONFIG, type Theme } from '../config/theme.config'

const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getStoredTheme = (): Theme => {
  const storedTheme = localStorage.getItem(THEME_CONFIG.storageKey)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return getSystemTheme()
}

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return getStoredTheme()
  })

  useEffect(() => {
    localStorage.setItem(THEME_CONFIG.storageKey, theme)

    applyTheme(theme)
  }, [theme])

  return {
    theme,
    setTheme,
  }
}

/**
 * This file defines the ThemeToggle component, which allows users to switch between light and dark themes.
 * It utilizes the useTheme hook to manage the current theme state and applies the selected theme to the application.
 * The component renders a button that toggles the theme when clicked, providing visual feedback through an icon.
 */
import Button from '../ui/Button'

import { useTheme } from '../../hooks/useTheme'
import { MoonIcon, SunIcon } from '../ui/icons'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="h-10 w-10 rounded-full p-0"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

export default ThemeToggle

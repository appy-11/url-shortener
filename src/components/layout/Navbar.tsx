/**
 * Navbar component
 * This component is used to display the navigation bar at the top of the page.
 * It includes the application name and navigation links defined in the NAVIGATION_CONFIG.
 * It also includes the ThemeToggle component to allow users to switch between light and dark themes.
 * The component uses Tailwind CSS for styling and is responsive to different screen sizes.
 * It uses the NavLink component from react-router-dom to handle navigation and active link styling.
 */
import { NavLink } from 'react-router-dom'

import { APP_CONFIG } from '../../config/app.config'
import { NAVIGATION_CONFIG } from '../../config/navigation.config'

import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <NavLink
          to="/"
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          {APP_CONFIG.name}
        </NavLink>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
            {NAVIGATION_CONFIG.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Navbar

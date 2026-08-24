/**
 * NotFoundPage component for handling 404 errors.
 * This page is displayed when a user navigates to a route that does not exist.
 * It provides a user-friendly message indicating that the page was not found and includes a link to return to the home page.
 * It applies default styles for a consistent look and feel across the application.
 */
import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'

const NotFoundPage = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-900 dark:text-white">404</p>

        <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
          Page not found
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist.
        </p>

        <Link to="/" className="mt-6 inline-block">
          <Button type="button">Go Home</Button>
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage

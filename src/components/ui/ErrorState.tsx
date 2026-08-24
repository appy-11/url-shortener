/**\
 * This component displays an error state with a title, message, and optional action button.
 * It is used to inform users about errors that occur during data fetching or other operations.
 * The component is styled with a red border and background to indicate an error state.
 * The component accepts the following props:
 * - `title`: An optional title for the error state. Defaults to "Something went wrong".
 * - `message`: A required message describing the error.
 */
import type { ReactNode } from 'react'

interface ErrorStateProps {
  title?: string
  message: string
  action?: ReactNode
}

const ErrorState = ({
  title = 'Something went wrong',
  message,
  action,
}: ErrorStateProps) => {
  return (
    <div
      className="rounded-xl border border-red-100 bg-red-50 px-6 py-12 text-center"
      role="alert"
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:text-red-400">
        !
      </div>

      <h3 className="mt-4 text-lg font-semibold text-red-900 dark:text-red-300">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-red-700 dark:text-red-400">
        {message}
      </p>

      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

export default ErrorState

/**
 * A component to display an empty state with a title, description, and optional action.
 */
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        ↗
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export default EmptyState

/**
 * Card component for rendering a styled card container.
 * This component accepts children elements and an optional className for additional styling.
 * It applies default styles for a consistent look and feel across the application.
 */
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card

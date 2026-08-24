/**
 * Button component for rendering a styled button element.
 * This component accepts standard button attributes and additional props for customization.
 * It applies default styles for a consistent look and feel across the application.
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  fullWidth?: boolean
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',

  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',

  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = 'primary', fullWidth = false, className = '', ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        {...props}
        className={[
          'rounded-lg px-4 py-3 text-sm font-medium transition',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-slate-500 dark:focus-visible:ring-offset-slate-950',
          VARIANT_STYLES[variant],
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button

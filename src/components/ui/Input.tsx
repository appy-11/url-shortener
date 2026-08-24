import type { InputHTMLAttributes } from 'react'

import FormError from './FormError'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  optional?: boolean
  error?: string
}

const Input = ({
  label,
  optional = false,
  error,
  id,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}

        {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </label>

      <input
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border px-4 py-3 transition outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-100 dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-950'
            : 'border-slate-300 focus:border-slate-500 focus:ring-slate-200 dark:border-slate-700 dark:focus:border-slate-400 dark:focus:ring-slate-800'
        } bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 ${className}`}
      />

      <div id={`${id}-error`}>
        <FormError message={error} />
      </div>
    </div>
  )
}

export default Input

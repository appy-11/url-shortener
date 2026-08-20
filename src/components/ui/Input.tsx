import type { InputHTMLAttributes } from "react";

import FormError from "./FormError";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
  error?: string;
}

const Input = ({
  label,
  optional = false,
  error,
  id,
  className = "",
  ...props
}: InputProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}

        {optional && (
          <span className="ml-1 font-normal text-slate-400">
            (optional)
          </span>
        )}
      </label>

      <input
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border px-4 py-3 outline-none transition ${error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          } ${className}`}
      />

      <div id={`${id}-error`}>
        <FormError message={error} />
      </div>
    </div>
  );
};

export default Input;
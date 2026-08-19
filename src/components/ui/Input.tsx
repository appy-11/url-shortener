/**
 * Input component for rendering a styled input field with an associated label.
 * This component accepts standard input attributes and additional props for customization.
 * It applies default styles for a consistent look and feel across the application.
 */
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
}

const Input = ({
  label,
  optional = false,
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
        className={`w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 ${className}`}
      />
    </div>
  );
};

export default Input;
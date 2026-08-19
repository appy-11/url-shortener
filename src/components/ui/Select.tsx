import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  optional?: boolean;
  options: readonly SelectOption[];
}

const Select = ({
  label,
  optional = false,
  options,
  id,
  className = "",
  ...props
}: SelectProps) => {
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

      <select
        id={id}
        {...props}
        className={`w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 ${className}`}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
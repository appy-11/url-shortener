/**
 * Select component for rendering a styled dropdown select element with an associated label.
 * This component accepts standard select attributes, an array of options, and additional props for customization.
 * It applies default styles for a consistent look and feel across the application.
 * Instead of using the native select element, this component uses a
 * button to toggle the visibility of the options list, allowing for more flexible styling and behavior.
 * This was done to provide a more customizable and visually appealing select component that can be
 *  easily integrated into the application's UI specifically for the mobile view.
 * @param id - The unique identifier for the select element, used for accessibility and form association.
 * @param label - The text label associated with the select element, displayed above the dropdown.
 */
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  id: string;
  label: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  optional?: boolean;
  placeholder?: string;
  renderOption?: (
    option: SelectOption,
    isSelected: boolean
  ) => ReactNode;
}

const Select = ({
  id,
  label,
  value,
  options,
  onChange,
  optional = false,
  placeholder = "Select an option",
  renderOption,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
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

      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-sm outline-none transition hover:border-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      >
        <span
          className={
            selectedOption
              ? "text-slate-900"
              : "text-slate-400"
          }
        >
          {selectedOption?.label ?? placeholder}
        </span>

        <svg
          className={`h-4 w-4 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
        >
          {options.map((option) => {
            const isSelected =
              option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center rounded-md px-3 py-2.5 text-left text-sm transition ${
                  isSelected
                    ? "bg-slate-100 font-medium text-slate-900"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {renderOption
                  ? renderOption(option, isSelected)
                  : option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
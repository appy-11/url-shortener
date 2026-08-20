/**
 * Select component for rendering a styled dropdown select element with an associated label.
 * This component accepts standard select attributes, an array of options, and additional props for customization.
 * It applies default styles for a consistent look and feel across the application.
 * Instead of using the native select element, this component uses a
 * button to toggle the visibility of the options list, allowing for more flexible styling and behavior.
 * This was done to provide a more customizable and visually appealing select component that can be
 * easily integrated into the application's UI specifically for the mobile view.
 * @param id - The unique identifier for the select element, used for accessibility and form association.
 * @param label - The text label associated with the select element, displayed above the dropdown.
 */
import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { FiChevronDown } from 'react-icons/fi'
import Button from './Button'

export interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  id: string
  label: string
  value: string
  options: readonly SelectOption[]
  onChange: (value: string) => void
  optional?: boolean
  placeholder?: string
}

const Select = ({
  id,
  label,
  value,
  options,
  onChange,
  optional = false,
  placeholder = 'Select an option',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const listboxId = useId()

  const selectedIndex = options.findIndex((option) => option.value === value)

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const openDropdown = () => {
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)

    setIsOpen(true)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const selectOption = (index: number) => {
    const option = options[index]

    if (!option) {
      return
    }

    onChange(option.value)
    closeDropdown()

    buttonRef.current?.focus()
  }

  const moveHighlight = (direction: 1 | -1) => {
    setHighlightedIndex((currentIndex) => {
      const nextIndex = currentIndex + direction

      if (nextIndex < 0) {
        return options.length - 1
      }

      if (nextIndex >= options.length) {
        return 0
      }

      return nextIndex
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()

        if (!isOpen) {
          openDropdown()
          return
        }

        selectOption(highlightedIndex)
        return

      case 'ArrowDown':
        event.preventDefault()

        if (!isOpen) {
          openDropdown()
          return
        }

        moveHighlight(1)
        return

      case 'ArrowUp':
        event.preventDefault()

        if (!isOpen) {
          openDropdown()
          return
        }

        moveHighlight(-1)
        return

      case 'Home':
        if (!isOpen) {
          return
        }

        event.preventDefault()
        setHighlightedIndex(0)
        return

      case 'End':
        if (!isOpen) {
          return
        }

        event.preventDefault()
        setHighlightedIndex(options.length - 1)
        return

      case 'Escape':
        if (!isOpen) {
          return
        }

        event.preventDefault()
        closeDropdown()
        return

      default:
        return
    }
  }

  /*
   * This effect is valid because we're subscribing
   * to an external DOM event.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </label>

      <Button
        ref={buttonRef}
        id={id}
        type="button"
        variant="secondary"
        fullWidth
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen ? `${listboxId}-option-${highlightedIndex}` : undefined
        }
        onClick={() => {
          if (isOpen) {
            closeDropdown()
          } else {
            openDropdown()
          }
        }}
        onKeyDown={handleKeyDown}
        className="flex justify-between text-left"
      >
        <span className={selectedOption ? 'text-slate-900' : 'text-slate-400'}>
          {selectedOption?.label ?? placeholder}
        </span>

        <FiChevronDown
          size={20}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={id}
          className="absolute right-0 left-0 z-50 mt-2 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value

            const isHighlighted = index === highlightedIndex

            return (
              <Button
                key={option.value}
                type="button"
                variant="ghost"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectOption(index)}
                className={`flex w-full items-center justify-start rounded-md px-3 py-2.5 text-left ${
                  isHighlighted ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                } ${isSelected ? 'font-medium' : ''}`}
              >
                {option.label}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Select

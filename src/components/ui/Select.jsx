import { useState, useRef, useEffect } from 'react'
import { ArrowDown2, ArrowUp2 } from 'iconsax-react'
import { common } from '../../content/strings'
import { colors } from '../../theme'

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  id,
  'aria-label': ariaLabel,
  className = '',
  searchable = true,
}) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const ref = useRef(null)
  const inputRef = useRef(null)

  const selectedOption = options.find((o) => (o.value ?? o) === value)
  const displayLabel = selectedOption ? (selectedOption.label ?? selectedOption.value ?? selectedOption) : ''

  const filteredOptions =
    searchable && inputValue.trim()
      ? options.filter((opt) => {
          const label = (opt.label ?? opt.value ?? opt).toString().toLowerCase()
          return label.includes(inputValue.trim().toLowerCase())
        })
      : options

  useEffect(() => {
    if (!open) setInputValue(displayLabel)
  }, [open, displayLabel])

  useEffect(() => {
    if (!open && value !== undefined) setInputValue(displayLabel)
  }, [value, displayLabel, open])

  useEffect(() => {
    if (open) {
      setInputValue(displayLabel)
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleSelect = (optValue) => {
    onChange(optValue)
    const opt = options.find((o) => (o.value ?? o) === optValue)
    const label = opt ? (opt.label ?? opt.value ?? opt) : ''
    setInputValue(label)
    setOpen(false)
  }

  const handleInputFocus = () => {
    if (disabled) return
    setOpen(true)
    setInputValue(displayLabel)
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    if (!open) setOpen(true)
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      setInputValue(displayLabel)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`.trim()}>
      <div className="relative flex w-full items-center">
        <input
          ref={inputRef}
          type="text"
          id={id}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={id ? `${id}-listbox` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
          placeholder={placeholder ?? common.searchPlaceholder}
          readOnly={!searchable}
          className={`w-full rounded-xl bg-surface-alt px-3 py-2 pr-9 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:pointer-events-none ${!searchable ? 'cursor-pointer' : ''}`}
        />
        <span
          className="pointer-events-none absolute right-3 flex shrink-0 items-center"
          aria-hidden
        >
          {open ? (
            <ArrowUp2 size={18} color={colors.textMuted} className="transition-transform duration-200" />
          ) : (
            <ArrowDown2 size={18} color={colors.textMuted} className="transition-transform duration-200" />
          )}
        </span>
      </div>
      {open && (
        <ul
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-xl bg-background py-1 shadow-lg"
          style={{ animation: 'dropdown-open 0.25s ease-out' }}
        >
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-sm text-text-muted">{common.noMatches}</li>
          ) : (
            filteredOptions.map((opt) => {
              const optValue = opt.value ?? opt
              const optLabel = opt.label ?? opt.value ?? opt
              const isSelected = (opt.value ?? opt) === value
              return (
                <li
                  key={optValue}
                  role="option"
                  aria-selected={isSelected}
                  className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
                    isSelected ? 'bg-surface-alt text-primary' : 'text-text hover:bg-surface-alt'
                  }`}
                  onClick={() => handleSelect(optValue)}
                >
                  {optLabel}
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}

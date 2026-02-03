import { useState, useRef, useEffect } from 'react'
import { Calendar, CalendarTick, CloseCircle } from 'iconsax-react'
import { datePicker as strings } from '../../content/strings'
import { colors } from '../../theme'

const ICON_MUTED = colors.textMuted
const ICON_PRIMARY = colors.primary

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function formatDisplay(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d)}-${pad(m)}-${y}`
}

function parseDisplay(str) {
  if (!str || !/^\d{1,2}-\d{1,2}-\d{4}$/.test(str.trim())) return null
  const [d, m, y] = str.trim().split('-').map(Number)
  if (m < 1 || m > 12 || d < 1 || d > 31) return null
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}

function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function toDateOnly(d) {
  return d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null
}

function parseISODate(str) {
  if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const daysInMonth = last.getDate()
  const prevMonth = new Date(year, month, 0)
  const prevDays = prevMonth.getDate()
  const rows = []
  let row = []
  for (let i = 0; i < startPad; i++) {
    row.push({ day: prevDays - startPad + i + 1, current: false, date: new Date(year, month - 1, prevDays - startPad + i + 1) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    row.push({ day: d, current: true, date: new Date(year, month, d) })
    if (row.length === 7) {
      rows.push(row)
      row = []
    }
  }
  if (row.length) {
    let next = 1
    while (row.length < 7) {
      row.push({ day: next, current: false, date: new Date(year, month + 1, next) })
      next++
    }
    rows.push(row)
  }
  return rows
}

export default function DatePicker({ value, onChange, id, disabled, placeholder, className = '', minDate, maxDate }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => (value ? parseDisplay(formatDisplay(value)) : new Date()) || new Date())
  const ref = useRef(null)

  const valueDate = value ? (value.includes('-') ? new Date(value + 'T12:00:00') : parseDisplay(value)) : null
  const displayStr = value ? formatDisplay(value) : ''
  const minDateObj = minDate ? (typeof minDate === 'string' ? parseISODate(minDate) : toDateOnly(minDate)) : null
  const maxDateObj = maxDate ? (typeof maxDate === 'string' ? parseISODate(maxDate) : toDateOnly(maxDate)) : null

  useEffect(() => {
    if (value && value.includes('-')) {
      const [y, m] = value.split('-').map(Number)
      setViewDate((prev) => (prev.getFullYear() === y && prev.getMonth() === m - 1 ? prev : new Date(y, m - 1, 1)))
    }
  }, [value])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long' })
  const calendar = getCalendarDays(year, month)

  const handleSelect = (date) => {
    const dateOnly = toDateOnly(date)
    if (minDateObj && dateOnly < minDateObj) return
    if (maxDateObj && dateOnly > maxDateObj) return
    onChange(toISO(date))
    setOpen(false)
  }

  const handleClear = () => {
    onChange('')
    setOpen(false)
  }

  const todayDate = toDateOnly(new Date())
  const canSelectToday = (!minDateObj || todayDate >= minDateObj) && (!maxDateObj || todayDate <= maxDateObj)

  const handleToday = () => {
    if (!canSelectToday) return
    const today = new Date()
    onChange(toISO(today))
    setViewDate(today)
    setOpen(false)
  }

  const lastDayPrevMonth = new Date(year, month, 0)
  const firstDayNextMonth = new Date(year, month + 1, 1)
  const canGoPrevMonth = !minDateObj || lastDayPrevMonth >= minDateObj
  const canGoNextMonth = !maxDateObj || firstDayNextMonth <= maxDateObj

  const prevMonth = () => canGoPrevMonth && setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => canGoNextMonth && setViewDate(new Date(year, month + 1, 1))

  return (
    <div ref={ref} className={`relative ${className}`.trim()}>
      <button
        type="button"
        id={id}
        aria-label={placeholder ?? strings.placeholder}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className="cursor-pointer flex w-full items-center justify-between gap-2 rounded-xl bg-surface-alt px-3 py-2 text-left text-sm text-text transition-colors disabled:opacity-50"
      >
        <span className={value ? '' : 'text-text-muted'}>{displayStr || (placeholder ?? strings.placeholder)}</span>
        <Calendar size={18} color={ICON_MUTED} className="shrink-0" aria-hidden />
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute left-0 top-full z-20 mt-1 w-64 rounded-2xl bg-background p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text">
              {monthName}, {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={prevMonth}
                disabled={!canGoPrevMonth}
                className="cursor-pointer rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-alt hover:text-text disabled:pointer-events-none disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={nextMonth}
                disabled={!canGoNextMonth}
                className="cursor-pointer rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-alt hover:text-text disabled:pointer-events-none disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mb-2 grid grid-cols-7 gap-0.5 text-center text-xs text-text-muted">
            {WEEKDAYS.map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-sm">
            {calendar.flat().map((cell, idx) => {
              const cellDateOnly = toDateOnly(cell.date)
              const isDisabled =
                (minDateObj && cellDateOnly < minDateObj) || (maxDateObj && cellDateOnly > maxDateObj)
              const isSelected =
                valueDate &&
                cell.date.getFullYear() === valueDate.getFullYear() &&
                cell.date.getMonth() === valueDate.getMonth() &&
                cell.date.getDate() === valueDate.getDate()
              const isToday = (() => {
                const t = new Date()
                return cell.date.getFullYear() === t.getFullYear() && cell.date.getMonth() === t.getMonth() && cell.date.getDate() === t.getDate()
              })()
              const isCurrentMonth = cell.current
              const base = 'rounded-lg py-2 transition-colors font-medium'
              const clickable = !isDisabled && 'cursor-pointer'
              const otherMonth = !isCurrentMonth && 'text-text-muted/70'
              const currentMonthDefault = isCurrentMonth && !isSelected && !isDisabled && 'text-text bg-transparent hover:bg-primary-muted hover:text-primary-dark focus-visible:bg-primary-muted focus-visible:text-primary-dark'
              const disabledCell = isDisabled && 'cursor-not-allowed opacity-40 text-text-muted'
              const todayHighlight = !isSelected && !isDisabled && isToday && 'bg-primary-muted text-primary-dark'
              const selected = isSelected && 'bg-primary text-white hover:bg-primary-dark hover:text-white focus-visible:bg-primary-dark focus-visible:text-white'
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(cell.date)}
                  disabled={isDisabled}
                  className={`${base} ${clickable} ${otherMonth} ${currentMonthDefault} ${disabledCell} ${todayHighlight} ${selected}`.trim()}
                >
                  {cell.day}
                </button>
              )
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-divider pt-3">
            <button
              type="button"
              onClick={handleClear}
              className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <CloseCircle size={16} color={ICON_PRIMARY} className="shrink-0" />
              {strings.clear}
            </button>
            <button
              type="button"
              onClick={handleToday}
              disabled={!canSelectToday}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
            >
              <CalendarTick size={16} color={ICON_PRIMARY} className="shrink-0" />
              {strings.today}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

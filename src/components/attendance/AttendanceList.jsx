import { useState, useEffect, useCallback, useMemo } from 'react'
import { CloseCircle, DocumentText } from 'iconsax-react'
import { api } from '../../api/client'
import { colors } from '../../theme'
import { attendance as strings, common } from '../../content/strings'
import { useToast } from '../../context/ToastContext'
import Table from '../ui/Table'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorMessage from '../ui/ErrorMessage'
import Select from '../ui/Select'
import DatePicker from '../ui/DatePicker'
import Button from '../ui/Button'

export default function AttendanceList({ refreshTrigger }) {
  const { toast } = useToast()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterEmployeeId, setFilterEmployeeId] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [appliedEmployeeId, setAppliedEmployeeId] = useState('')
  const [appliedDateFrom, setAppliedDateFrom] = useState('')
  const [appliedDateTo, setAppliedDateTo] = useState('')
  const [dateError, setDateError] = useState('')

  const todayISO = useMemo(() => {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
  }, [])

  const fetchAttendance = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get('/api/attendance')
      setList(Array.isArray(data) ? data : data?.attendance ?? data?.records ?? data?.data ?? [])
    } catch (err) {
      const msg = err.message || common.error
      setError(msg)
      toast.error(msg)
      setList([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance, refreshTrigger])

  const employeeOptions = useMemo(() => {
    const seen = new Set()
    const options = []
    list.forEach((r) => {
      const id = r.employeeId ?? r.employee_id ?? ''
      const name = r.employeeName ?? r.employee_name ?? r.fullName ?? r.full_name ?? id
      if (id && !seen.has(id)) {
        seen.add(id)
        options.push({ value: id, label: `${name} (${id})` })
      }
    })
    return options.sort((a, b) => (a.label < b.label ? -1 : 1))
  }, [list])

  const filteredList = useMemo(() => {
    let result = list
    if (appliedEmployeeId) {
      result = result.filter((r) => (r.employeeId ?? r.employee_id) === appliedEmployeeId)
    }
    if (appliedDateFrom) {
      result = result.filter((r) => {
        const d = r.date ?? r.attendance_date ?? ''
        return d >= appliedDateFrom
      })
    }
    if (appliedDateTo) {
      result = result.filter((r) => {
        const d = r.date ?? r.attendance_date ?? ''
        return d <= appliedDateTo
      })
    }
    return result
  }, [list, appliedEmployeeId, appliedDateFrom, appliedDateTo])

  const handleFromChange = (value) => {
    setFilterDateFrom(value)
    setDateError('')
    if (filterDateTo && value && value > filterDateTo) setFilterDateTo(value)
  }

  const handleToChange = (value) => {
    setFilterDateTo(value)
    setDateError('')
    if (filterDateFrom && value && value < filterDateFrom) setFilterDateFrom(value)
  }

  const handleApplyFilters = () => {
    if (filterDateFrom && filterDateTo && filterDateFrom > filterDateTo) {
      setDateError(strings.dateFromAfterTo)
      return
    }
    setDateError('')
    setAppliedEmployeeId(filterEmployeeId)
    setAppliedDateFrom(filterDateFrom)
    setAppliedDateTo(filterDateTo)
  }

  const columns = [
    { key: 'date', label: strings.dateColumn },
    { key: 'employee', label: strings.employeeColumn },
    { key: 'status', label: strings.statusColumn },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-background py-12">
        <LoadingSpinner />
        <span className="text-sm text-text-muted">{common.loading}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <ErrorMessage message={error} onRetry={fetchAttendance} onDismiss={() => setError(null)} />
      )}
      <div className="flex flex-col gap-4">
        <h3 className="flex items-center gap-2 text-lg font-medium text-text">
          <DocumentText size={20} color={colors.textMuted} className="shrink-0" />
          {strings.records}
        </h3>
        <div className="flex flex-wrap items-end gap-3 sm:gap-4">
          {employeeOptions.length > 0 && (
            <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:min-w-[200px]">
              <div className="relative min-w-0 flex-1">
                <Select
                  id="attendance-filter-employee"
                  value={filterEmployeeId}
                  onChange={setFilterEmployeeId}
                  options={employeeOptions}
                  placeholder={strings.filterByEmployee}
                  aria-label={strings.filterByEmployee}
                />
              </div>
              {filterEmployeeId && (
                <button
                  type="button"
                  onClick={() => setFilterEmployeeId('')}
                  aria-label={common.clearFilter ?? 'Clear filter'}
                  className="cursor-pointer shrink-0 rounded-xl p-2 text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
                >
                  <CloseCircle size={20} color={colors.textMuted} />
                </button>
              )}
            </div>
          )}
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:min-w-[160px]">
            <label htmlFor="attendance-filter-from" className="shrink-0 text-sm font-medium text-text">
              {strings.filterByDateFrom}
            </label>
            <DatePicker
              id="attendance-filter-from"
              value={filterDateFrom}
              onChange={handleFromChange}
              placeholder={strings.filterDatePlaceholder}
              maxDate={todayISO}
            />
          </div>
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:min-w-[160px]">
            <label htmlFor="attendance-filter-to" className="shrink-0 text-sm font-medium text-text">
              {strings.filterByDateTo}
            </label>
            <DatePicker
              id="attendance-filter-to"
              value={filterDateTo}
              onChange={handleToChange}
              placeholder={strings.filterDatePlaceholder}
              minDate={filterDateFrom || undefined}
              maxDate={todayISO}
            />
          </div>
          <Button
            type="button"
            onClick={handleApplyFilters}
            className="inline-flex cursor-pointer items-center gap-2"
          >
            {common.search}
          </Button>
        </div>
        {dateError && <p className="text-sm text-danger">{dateError}</p>}
      </div>
      <Table
        columns={columns}
        empty={strings.empty}
        emptyAction={null}
        isEmpty={filteredList.length === 0}
      >
        {filteredList.map((record, index) => {
          const dateStr = record.date ?? record.attendance_date ?? '—'
          const employeeName = record.employeeName ?? record.employee_name ?? record.fullName ?? record.full_name ?? record.employeeId ?? record.employee_id ?? '—'
          const statusVal = record.status ?? '—'
          return (
            <tr key={record.id ?? record.attendance_id ?? index} className="border-t border-surface-alt">
              <td className="px-4 py-3 text-sm text-text">{dateStr}</td>
              <td className="px-4 py-3 text-sm text-text">{employeeName}</td>
              <td className="px-4 py-3 text-sm text-text">{statusVal}</td>
            </tr>
          )
        })}
      </Table>
    </div>
  )
}

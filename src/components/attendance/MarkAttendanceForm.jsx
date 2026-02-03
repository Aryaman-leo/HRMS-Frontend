import { useState, useEffect, useMemo } from 'react'
import { Calendar, Save2, SearchNormal1 } from 'iconsax-react'
import { api } from '../../api/client'
import { colors } from '../../theme'
import { attendance as strings, common, validation } from '../../content/strings'
import { employees as empStrings } from '../../content/strings'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import Card from '../ui/Card'
import DatePicker from '../ui/DatePicker'
import Pagination, { DEFAULT_PAGE_SIZE } from '../ui/Pagination'
import Skeleton from '../ui/Skeleton'

const ICON_PRIMARY = colors.primary
const ICON_MUTED = colors.textMuted
const ICON_ON_PRIMARY = colors.background

export default function MarkAttendanceForm({ onMarked }) {
  const { toast } = useToast()
  const [employees, setEmployees] = useState([])
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [rowStatus, setRowStatus] = useState({})
  const [savedForDate, setSavedForDate] = useState({})
  const [loading, setLoading] = useState(false)
  const [savingRow, setSavingRow] = useState(null)
  const [loadEmployees, setLoadEmployees] = useState(true)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api.get('/api/employees')
        const list = Array.isArray(data) ? data : data?.employees ?? data?.data ?? []
        if (!cancelled) setEmployees(list)
      } catch {
        if (!cancelled) setEmployees([])
      } finally {
        if (!cancelled) setLoadEmployees(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!date || loadEmployees) return
    let cancelled = false
    setLoadingAttendance(true)
    ;(async () => {
      try {
        const data = await api.get('/api/attendance')
        const records = Array.isArray(data) ? data : data?.attendance ?? data?.records ?? data?.data ?? []
        const forDate = records.filter((r) => (r.date ?? r.attendance_date) === date)
        const prefill = {}
        forDate.forEach((r) => {
          const eid = r.employeeId ?? r.employee_id
          if (eid && r.status) prefill[eid] = r.status
        })
        if (!cancelled) {
          setSavedForDate(prefill)
          setRowStatus(prefill)
        }
      } catch {
        if (!cancelled) {
          setSavedForDate({})
          setRowStatus({})
        }
      } finally {
        if (!cancelled) setLoadingAttendance(false)
      }
    })()
    return () => { cancelled = true }
  }, [date, loadEmployees])

  const filteredEmployees = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase()
    if (!q) return employees
    return employees.filter((emp) => {
      const id = (emp.employeeId ?? emp.employee_id ?? '').toLowerCase()
      const name = (emp.fullName ?? emp.full_name ?? '').toLowerCase()
      return id.includes(q) || name.includes(q)
    })
  }, [employees, searchQuery])

  const paginatedEmployees = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredEmployees.slice(start, start + pageSize)
  }, [filteredEmployees, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [searchQuery])
  useEffect(() => {
    setPage(1)
  }, [pageSize])

  const rowsWithStatus = Object.entries(rowStatus).filter(([, s]) => s && s !== '')
  const hasDirtyRows = rowsWithStatus.some(
    ([eid, status]) => savedForDate[eid] !== status
  )
  const hasAnyStatus = rowsWithStatus.length > 0

  async function handleSaveAll(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!date) {
      setError(validation.selectDate)
      toast.error(validation.selectDate)
      return
    }
    if (!hasDirtyRows) return
    const dirtyRecords = rowsWithStatus.filter(([eid, status]) => savedForDate[eid] !== status)
    if (dirtyRecords.length === 0) return
    setLoading(true)
    try {
      const records = dirtyRecords.map(([employeeId, status]) => ({ employeeId, status }))
      const result = await api.post('/api/attendance/bulk', { date, records })
      const failed = result?.failed ?? 0
      if (failed === records.length) {
        setError(common.error)
        toast.error(common.error)
      } else {
        const successMsg = failed > 0 ? `${strings.saveAllSuccess} (${failed} failed.)` : strings.saveAllSuccess
        setSuccess(successMsg)
        toast.success(successMsg)
        setSavedForDate((prev) => ({ ...prev, ...Object.fromEntries(dirtyRecords) }))
        onMarked?.()
      }
    } catch (err) {
      const msg = err.message || common.error
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  function setStatusFor(employeeId, status) {
    setRowStatus((prev) => ({ ...prev, [employeeId]: status }))
  }

  async function handleSaveRow(employeeId) {
    const status = rowStatus[employeeId]
    if (!date || !status) return
    if (savedForDate[employeeId] === status) return
    setError(null)
    setSuccess(null)
    setSavingRow(employeeId)
    try {
      await api.post('/api/attendance', { employeeId, date, status })
      setSavedForDate((prev) => ({ ...prev, [employeeId]: status }))
      setSuccess(strings.markSuccess)
      toast.success(strings.markSuccess)
      onMarked?.()
    } catch (err) {
      const msg = err.message || common.error
      setError(msg)
      toast.error(msg)
    } finally {
      setSavingRow(null)
    }
  }

  if (loadEmployees) {
    return (
      <Card>
        <Skeleton className="mb-1 h-6 w-48" />
        <Skeleton className="mb-4 h-4 w-full max-w-md" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl bg-surface-alt">
          <div className="border-b border-divider px-4 py-3">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 border-t border-divider px-4 py-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (employees.length === 0) {
    return (
      <Card>
        <p className="text-sm text-text-muted">{strings.noEmployees}</p>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="mb-1 flex items-center gap-2 text-lg font-medium text-text">
        <Calendar size={22} color={ICON_PRIMARY} className="shrink-0" />
        {strings.formTitle}
      </h3>
      <p className="mb-4 text-sm text-text-muted">{strings.formSubtitle}</p>
      <form onSubmit={handleSaveAll} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl bg-surface-alt px-4 py-3 text-sm text-primary">
            {success}
          </div>
        )}
        <div className="mb-4 flex flex-wrap items-end gap-3 sm:gap-4">
          <div className="w-full min-w-0 sm:min-w-[200px]">
            <label htmlFor="attendance-date" className="mb-1 flex items-center gap-2 text-sm font-medium text-text">
              <Calendar size={18} color={ICON_MUTED} className="shrink-0" />
              {strings.dateLabel}
            </label>
            <DatePicker
              id="attendance-date"
              value={date}
              onChange={setDate}
              placeholder={strings.date}
              maxDate={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <Button
            type="submit"
            disabled={loading || loadingAttendance || !hasDirtyRows}
            className="inline-flex cursor-pointer items-center gap-2"
          >
            <Save2 size={18} color={ICON_ON_PRIMARY} className="shrink-0" />
            {loading ? common.loading : strings.saveAttendance}
          </Button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label htmlFor="mark-attendance-search" className="sr-only">
            {empStrings.searchPlaceholder}
          </label>
          <div className="relative flex-1 sm:max-w-xs">
            <SearchNormal1
              size={18}
              color={colors.textMuted}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 shrink-0"
            />
            <input
              id="mark-attendance-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={empStrings.searchPlaceholder}
              aria-label={empStrings.searchPlaceholder}
              className="w-full rounded-xl border border-divider bg-background py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-divider bg-surface-alt">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                    {strings.employeeColumn}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                    {strings.statusColumn}
                  </th>
                  <th className="w-12 px-4 py-3 text-right text-sm font-medium text-text-muted" aria-label="Save" />
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp) => {
                const id = emp.employeeId ?? emp.employee_id
                const name = emp.fullName ?? emp.full_name
                const value = rowStatus[id] ?? ''
                return (
                  <tr key={id} className="border-t border-divider">
                    <td className="px-4 py-3 text-sm text-text">
                      {name} <span className="text-text-muted">({id})</span>
                    </td>
                    <td className="px-4 py-2">
                      <fieldset
                        role="radiogroup"
                        aria-label={`${strings.status} for ${name}`}
                        className="flex flex-wrap gap-4"
                      >
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name={`status-${id}`}
                            value="Present"
                            checked={value === 'Present'}
                            onChange={() => setStatusFor(id, 'Present')}
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="text-sm text-text">{strings.statusPresent}</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name={`status-${id}`}
                            value="Absent"
                            checked={value === 'Absent'}
                            onChange={() => setStatusFor(id, 'Absent')}
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="text-sm text-text">{strings.statusAbsent}</span>
                        </label>
                      </fieldset>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleSaveRow(id)}
                        disabled={
                          !value ||
                          savingRow === id ||
                          loading ||
                          loadingAttendance ||
                          savedForDate[id] === value
                        }
                        aria-label={`${common.save} ${name}`}
                        className="cursor-pointer rounded-xl p-2 text-primary transition-colors hover:bg-primary-muted disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {savingRow === id ? (
                          <Skeleton className="h-5 w-5 rounded" />
                        ) : (
                          <Save2 size={20} color={savedForDate[id] === value ? ICON_MUTED : ICON_PRIMARY} className="shrink-0" />
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={page}
            totalItems={filteredEmployees.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </form>
    </Card>
  )
}

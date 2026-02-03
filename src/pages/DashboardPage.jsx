import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Home2, People, Buildings2, CalendarTick, TickCircle, CloseCircle } from 'iconsax-react'
import { api } from '../api/client'
import { colors } from '../theme'
import { dashboard as strings } from '../content/strings'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Skeleton from '../components/ui/Skeleton'
import SkeletonCard from '../components/ui/SkeletonCard'
import SkeletonTable from '../components/ui/SkeletonTable'

function StatCard({ icon: Icon, label, value, subtext, to, color = colors.primary }) {
  const content = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-text-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
        {subtext != null && <p className="mt-0.5 text-xs text-text-muted">{subtext}</p>}
      </div>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-alt">
        <Icon size={24} color={color} className="shrink-0" />
      </div>
    </div>
  )
  if (to) {
    return (
      <Link to={to} className="block transition-opacity hover:opacity-90">
        <Card className="h-full">{content}</Card>
      </Link>
    )
  }
  return <Card className="h-full">{content}</Card>
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    todayPresent: 0,
    todayAbsent: 0,
  })
  const [summary, setSummary] = useState([])
  const [summarySearch, setSummarySearch] = useState('')

  const filteredSummary = useMemo(() => {
    if (!summarySearch.trim()) return summary
    const q = summarySearch.trim().toLowerCase()
    return summary.filter((row) => {
      const name = (row.employeeName ?? row.employee_name ?? '').toLowerCase()
      const id = (row.employeeId ?? row.employee_id ?? '').toLowerCase()
      return name.includes(q) || id.includes(q)
    })
  }, [summary, summarySearch])

  useEffect(() => {
    let cancelled = false
    const today = new Date().toISOString().slice(0, 10)

    async function load() {
      setLoading(true)
      try {
        const [empRes, deptRes, attRes, summaryRes] = await Promise.all([
          api.get('/api/employees'),
          api.get('/api/departments'),
          api.get('/api/attendance'),
          api.get('/api/attendance/summary').catch(() => []),
        ])
        if (cancelled) return

        const employees = Array.isArray(empRes) ? empRes : empRes?.employees ?? empRes?.data ?? []
        const departments = Array.isArray(deptRes) ? deptRes : deptRes?.departments ?? deptRes?.data ?? []
        const attendance = Array.isArray(attRes) ? attRes : attRes?.attendance ?? attRes?.records ?? attRes?.data ?? []
        const summaryList = Array.isArray(summaryRes) ? summaryRes : summaryRes?.summary ?? summaryRes?.data ?? []

        const todayRecords = attendance.filter(
          (r) => (r.date ?? r.attendance_date) === today
        )
        const present = todayRecords.filter((r) => (r.status || '').toLowerCase() === 'present').length
        const absent = todayRecords.filter((r) => (r.status || '').toLowerCase() === 'absent').length

        setStats({
          employees: employees.length,
          departments: departments.length,
          todayPresent: present,
          todayAbsent: absent,
        })
        setSummary(summaryList)
      } catch {
        if (!cancelled) {
          setStats({ employees: 0, departments: 0, todayPresent: 0, todayAbsent: 0 })
          setSummary([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        <section>
          <Skeleton className="mb-3 h-4 w-20" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </section>
        <section>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-10 w-56 rounded-xl" />
          </div>
          <div className="max-h-[320px] overflow-hidden rounded-2xl bg-background">
            <SkeletonTable columnCount={3} rowCount={5} />
          </div>
        </section>
        <section>
          <Skeleton className="mb-3 h-4 w-24" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-36 rounded-xl" />
            <Skeleton className="h-12 w-28 rounded-xl" />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-text sm:text-2xl">
        <Home2 size={28} color={colors.primary} className="shrink-0" />
        {strings.title}
      </h2>

      <section>
        <h3 className="mb-3 text-sm font-medium text-text-muted">{strings.overview}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={People}
            label={strings.totalEmployees}
            value={stats.employees}
            to="/employees"
          />
          <StatCard
            icon={Buildings2}
            label={strings.totalDepartments}
            value={stats.departments}
            to="/departments"
          />
          <StatCard
            icon={TickCircle}
            label={strings.todayPresent}
            value={stats.todayPresent}
            subtext={strings.today}
            to="/attendance"
            color={colors.success}
          />
          <StatCard
            icon={CloseCircle}
            label={strings.todayAbsent}
            value={stats.todayAbsent}
            subtext={strings.today}
            to="/attendance"
            color={colors.danger}
          />
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-medium text-text-muted">{strings.attendanceSummary}</h3>
          <input
            type="search"
            value={summarySearch}
            onChange={(e) => setSummarySearch(e.target.value)}
            placeholder={strings.searchPlaceholder}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-56"
            aria-label={strings.searchPlaceholder}
          />
        </div>
        <div className="max-h-[320px] overflow-auto rounded-2xl bg-background">
          <Table
            columns={[
              { key: 'employee', label: strings.employee },
              { key: 'presentDays', label: strings.presentDays },
              { key: 'absentDays', label: strings.absentDays },
            ]}
            empty={strings.noData}
            isEmpty={filteredSummary.length === 0}
          >
            {filteredSummary.map((row) => (
              <tr key={row.employeeId ?? row.employee_id} className="border-t border-divider">
                <td className="px-4 py-3 text-sm text-text">
                  <div>
                    <span>{row.employeeName ?? row.employee_name ?? '—'}</span>
                    {(row.employeeId ?? row.employee_id) && (
                      <span className="mt-0.5 block text-xs italic text-text-muted">
                        {row.employeeId ?? row.employee_id}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text">{row.presentDays ?? row.present_days ?? 0}</td>
                <td className="px-4 py-3 text-sm text-text">{row.absentDays ?? row.absent_days ?? 0}</td>
              </tr>
            ))}
          </Table>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium text-text-muted">{strings.quickLinks}</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/employees"
            className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm font-medium text-text shadow-sm ring-1 ring-divider transition-colors hover:bg-surface-alt hover:ring-primary/30"
          >
            <People size={18} color={colors.primary} className="shrink-0" />
            {strings.goToEmployees}
          </Link>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm font-medium text-text shadow-sm ring-1 ring-divider transition-colors hover:bg-surface-alt hover:ring-primary/30"
          >
            <Buildings2 size={18} color={colors.primary} className="shrink-0" />
            {strings.goToDepartments}
          </Link>
          <Link
            to="/attendance"
            className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm font-medium text-text shadow-sm ring-1 ring-divider transition-colors hover:bg-surface-alt hover:ring-primary/30"
          >
            <CalendarTick size={18} color={colors.primary} className="shrink-0" />
            {strings.goToAttendance}
          </Link>
        </div>
      </section>
    </div>
  )
}

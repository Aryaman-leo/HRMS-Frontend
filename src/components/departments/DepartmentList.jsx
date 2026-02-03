import { useState, useEffect, useCallback } from 'react'
import { Add, ArrowDown2, ArrowRight2, Trash } from 'iconsax-react'
import { api } from '../../api/client'
import { colors } from '../../theme'
import { departments as strings, common } from '../../content/strings'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import Table from '../ui/Table'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorMessage from '../ui/ErrorMessage'

export default function DepartmentList({ refreshTrigger, onListChange }) {
  const { toast } = useToast()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedIds, setExpandedIds] = useState(new Set())

  function toggleExpanded(id) {
    setExpandedIds((prev) => {
      if (prev.has(id)) return new Set()
      return new Set([id])
    })
  }

  const fetchDepartments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get('/api/departments')
      setList(Array.isArray(data) ? data : data?.departments ?? data?.data ?? [])
    } catch (err) {
      const msg = err.message || common.error
      setError(msg)
      toast.error(msg)
      setList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments, refreshTrigger])

  async function handleDelete(id) {
    if (!window.confirm(strings.deleteConfirm)) return
    try {
      await api.delete(`/api/departments/${id}`)
      setList((prev) => prev.filter((d) => d.id !== id))
      onListChange?.()
      toast.success(strings.deleteSuccess)
    } catch (err) {
      const msg = err.message || common.error
      setError(msg)
      toast.error(msg)
    }
  }

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
        <ErrorMessage message={error} onRetry={fetchDepartments} onDismiss={() => setError(null)} />
      )}
      <Table
        columns={[
          { key: 'name', label: strings.name },
          { key: 'employees', label: strings.employees },
          { key: 'actions', label: strings.actions },
        ]}
        empty={strings.empty}
        emptyAction={
          <Button variant="primary" className="inline-flex cursor-pointer items-center gap-2">
            <Add size={18} color={colors.background} className="shrink-0" />
            {strings.emptyAction}
          </Button>
        }
        isEmpty={list.length === 0}
      >
        {list.map((dept) => {
          const isExpanded = expandedIds.has(dept.id)
          const employeeCount = dept.employees?.length ?? 0
          return (
            <tr
              key={dept.id}
              className="border-t border-divider align-top"
            >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(dept.id)}
                    className="flex items-center gap-2 text-left text-sm font-medium text-text hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 rounded transition-colors duration-200"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? strings.collapse : strings.expand}
                  >
                    <span
                      className={`inline-flex shrink-0 transition-transform duration-300 ease-out ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
                      aria-hidden
                    >
                      <ArrowRight2
                        size={18}
                        color={isExpanded ? colors.primary : colors.textMuted}
                        className="transition-colors duration-200"
                      />
                    </span>
                    {dept.name ?? '—'}
                  </button>
                </td>
                <td className="px-4 py-3 align-top">
                  {/* Summary when collapsed */}
                  {!isExpanded && (
                    <span className="inline-block text-sm text-text-muted transition-opacity duration-200">
                      {employeeCount === 0
                        ? strings.noEmployees
                        : typeof strings.employeeCount === 'function'
                          ? strings.employeeCount(employeeCount)
                          : `${employeeCount} employee(s)`}
                    </span>
                  )}
                  {/* Expandable list with height + opacity animation */}
                  {employeeCount > 0 && (
                    <div
                      className="overflow-hidden transition-[max-height] duration-300 ease-out"
                      style={{ maxHeight: isExpanded ? 400 : 0 }}
                      aria-hidden={!isExpanded}
                    >
                      <ul
                        className="space-y-1.5 pt-1 text-sm text-text transition-opacity duration-300 ease-out"
                        style={{ opacity: isExpanded ? 1 : 0 }}
                      >
                        {dept.employees.map((emp, i) => (
                          <li
                            key={emp.id}
                            className="flex flex-wrap gap-x-2 gap-y-0 opacity-0"
                            style={
                              isExpanded
                                ? {
                                    animation: 'accordion-fade-in 0.25s ease-out forwards',
                                    animationDelay: `${i * 35}ms`,
                                  }
                                : undefined
                            }
                          >
                            <span className="font-mono text-text-muted">{emp.employeeId ?? emp.employee_id}</span>
                            <span>{emp.fullName ?? emp.full_name}</span>
                            <span className="text-text-muted">({emp.email})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {isExpanded && employeeCount === 0 && (
                    <span className="text-sm text-text-muted">{strings.noEmployees}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="danger"
                    type="button"
                    onClick={() => handleDelete(dept.id)}
                    className="inline-flex cursor-pointer items-center gap-2 hover:text-white"
                  >
                    <Trash size={18} color="currentColor" className="shrink-0" />
                    {common.delete}
                  </Button>
                </td>
              </tr>
          )
        })}
      </Table>
    </div>
  )
}

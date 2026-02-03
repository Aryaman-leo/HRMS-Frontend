import { useState, useEffect, useCallback, useMemo } from 'react'
import { Add, SearchNormal1, Trash } from 'iconsax-react'
import { api } from '../../api/client'
import { colors } from '../../theme'
import { employees as strings, common } from '../../content/strings'
import Button from '../ui/Button'
import Table from '../ui/Table'
import Modal from '../ui/Modal'
import Pagination, { DEFAULT_PAGE_SIZE } from '../ui/Pagination'
import SkeletonTable from '../ui/SkeletonTable'
import ErrorMessage from '../ui/ErrorMessage'

export default function EmployeeList({ refreshTrigger, onListChange }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get('/api/employees')
      setList(Array.isArray(data) ? data : data?.employees ?? data?.data ?? [])
      onListChange?.()
    } catch (err) {
      setError(err.message || common.error)
      setList([])
    } finally {
      setLoading(false)
    }
  }, [onListChange])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees, refreshTrigger])

  async function handleDelete(id) {
    try {
      await api.delete(`/api/employees/${id}`)
      setList((prev) => prev.filter((e) => e.id !== id))
      setDeleteTarget(null)
      onListChange?.()
    } catch (err) {
      setError(err.message || common.error)
    }
  }

  function openDeleteModal(emp) {
    setDeleteTarget(emp)
  }

  const filteredList = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase()
    if (!q) return list
    return list.filter((emp) => {
      const id = (emp.employeeId ?? emp.employee_id ?? '').toLowerCase()
      const name = (emp.fullName ?? emp.full_name ?? '').toLowerCase()
      return id.includes(q) || name.includes(q)
    })
  }, [list, searchQuery])

  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredList.slice(start, start + pageSize)
  }, [filteredList, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [searchQuery])
  useEffect(() => {
    setPage(1)
  }, [pageSize])

  const columns = [
    { key: 'employeeId', label: strings.employeeId },
    { key: 'fullName', label: strings.fullName },
    { key: 'email', label: strings.email },
    { key: 'department', label: strings.department },
    { key: 'actions', label: strings.actions },
  ]

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl bg-background">
        <SkeletonTable columnCount={5} rowCount={5} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <ErrorMessage message={error} onRetry={fetchEmployees} onDismiss={() => setError(null)} />
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="employee-search" className="sr-only">
          {strings.searchPlaceholder}
        </label>
        <div className="relative flex-1 sm:max-w-xs">
          <SearchNormal1
            size={18}
            color={colors.textMuted}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 shrink-0"
          />
          <input
            id="employee-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={strings.searchPlaceholder}
            aria-label={strings.searchPlaceholder}
            className="w-full rounded-xl border border-divider bg-background py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-divider bg-background">
        <Table
          columns={columns}
          empty={searchQuery.trim() ? common.noMatches : strings.empty}
          emptyAction={
            !searchQuery.trim() ? (
              <Button variant="primary" className="inline-flex items-center gap-2">
                <Add size={18} color={colors.background} className="shrink-0" />
                {strings.emptyAction}
              </Button>
            ) : null
          }
          isEmpty={filteredList.length === 0}
        >
          {paginatedList.map((emp) => (
            <tr key={emp.id} className="border-t border-divider">
              <td className="px-4 py-3 text-sm text-text">{emp.employeeId}</td>
              <td className="px-4 py-3 text-sm text-text">{emp.fullName}</td>
              <td className="px-4 py-3 text-sm text-text">{emp.email}</td>
              <td className="px-4 py-3 text-sm text-text">{emp.departmentName}</td>
              <td className="px-4 py-3">
                <Button variant="danger" type="button" onClick={() => openDeleteModal(emp)} className="inline-flex items-center gap-2 [&_svg]:hover:text-white">
                  <Trash size={18} color="currentColor" className="shrink-0" />
                  {common.delete}
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        <Pagination
          currentPage={page}
          totalItems={filteredList.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={strings.deleteConfirm}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              {common.cancel}
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
            >
              {common.delete}
            </Button>
          </>
        }
      >
        {deleteTarget && (
          <div className="space-y-3">
            <p>Are you sure you want to delete this employee? This cannot be undone.</p>
            <dl className="rounded-xl bg-surface-alt p-4 text-sm space-y-2">
              <div className="flex gap-2">
                <dt className="min-w-32 font-medium text-text-muted">{strings.employeeId}</dt>
                <dd className="text-text">{deleteTarget.employeeId}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="min-w-32 font-medium text-text-muted">{strings.fullName}</dt>
                <dd className="text-text">{deleteTarget.fullName}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="min-w-32 font-medium text-text-muted">{strings.department}</dt>
                <dd className="text-text">{deleteTarget.departmentName}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  )
}

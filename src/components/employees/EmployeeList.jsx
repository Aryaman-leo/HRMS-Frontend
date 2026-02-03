import { useState, useEffect, useCallback } from 'react'
import { Add, Trash } from 'iconsax-react'
import { api } from '../../api/client'
import { colors } from '../../theme'
import { employees as strings, common } from '../../content/strings'
import Button from '../ui/Button'
import Table from '../ui/Table'
import Modal from '../ui/Modal'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorMessage from '../ui/ErrorMessage'

export default function EmployeeList({ refreshTrigger, onListChange }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

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

  const columns = [
    { key: 'employeeId', label: strings.employeeId },
    { key: 'fullName', label: strings.fullName },
    { key: 'email', label: strings.email },
    { key: 'department', label: strings.department },
    { key: 'actions', label: strings.actions },
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
        <ErrorMessage message={error} onRetry={fetchEmployees} onDismiss={() => setError(null)} />
      )}
      <Table
        columns={columns}
        empty={strings.empty}
        emptyAction={
          <Button variant="primary" className="inline-flex items-center gap-2">
            <Add size={18} color={colors.background} className="shrink-0" />
            {strings.emptyAction}
          </Button>
        }
        isEmpty={list.length === 0}
      >
        {list.map((emp) => (
            <tr key={emp.id} className="border-t border-divider">
              <td className="px-4 py-3 text-sm text-text">{emp.employeeId}</td>
              <td className="px-4 py-3 text-sm text-text">{emp.fullName}</td>
              <td className="px-4 py-3 text-sm text-text">{emp.email}</td>
              <td className="px-4 py-3 text-sm text-text">{emp.departmentName}</td>
              <td className="px-4 py-3">
                <Button variant="danger" type="button" onClick={() => openDeleteModal(emp)} className="inline-flex items-center gap-2">
                  <Trash size={18} color={colors.danger} className="shrink-0" />
                  {common.delete}
                </Button>
              </td>
            </tr>
        ))}
      </Table>

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

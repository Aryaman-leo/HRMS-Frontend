import { useState, useEffect } from 'react'
import { Add } from 'iconsax-react'
import { api } from '../../api/client'
import { colors } from '../../theme'
import { employees as strings, common, validation } from '../../content/strings'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Select from '../ui/Select'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function EmployeeForm({ onAdded, extraActions }) {
  const { toast } = useToast()
  const [employeeId, setEmployeeId] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [departments, setDepartments] = useState([])
  const [loadDepts, setLoadDepts] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api.get('/api/departments')
        const list = Array.isArray(data) ? data : data?.departments ?? data?.data ?? []
        if (!cancelled) setDepartments(list)
      } catch {
        if (!cancelled) setDepartments([])
      } finally {
        if (!cancelled) setLoadDepts(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const departmentOptions = departments.map((d) => ({ value: d.id, label: d.name }))

  function validate() {
    const errors = {}
    if (!employeeId.trim()) errors.employeeId = validation.required
    if (!fullName.trim()) errors.fullName = validation.required
    if (!email.trim()) errors.email = validation.required
    else if (!emailRegex.test(email)) errors.email = validation.emailInvalid
    if (!departmentId && departmentId !== 0) errors.department = validation.required
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    const deptId = typeof departmentId === 'string' ? parseInt(departmentId, 10) : departmentId
    if (Number.isNaN(deptId)) {
      setFieldErrors((prev) => ({ ...prev, department: validation.required }))
      return
    }
    setLoading(true)
    try {
      await api.post('/api/employees', {
        employeeId: employeeId.trim(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        departmentId: deptId,
      })
      setEmployeeId('')
      setFullName('')
      setEmail('')
      setDepartmentId('')
      setFieldErrors({})
      onAdded?.()
      toast.success(strings.addSuccess)
    } catch (err) {
      const msg = err.message || common.error
      setError(msg)
      toast.error(msg)
      if (err.status === 409 && (msg || '').toLowerCase().includes('email')) {
        setFieldErrors((prev) => ({ ...prev, email: validation.emailExists }))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h3 className="mb-4 text-lg font-medium text-text">{strings.formTitle}</h3>
      {!loadDepts && departmentOptions.length === 0 && (
        <p className="mb-4 text-sm text-text-muted">{strings.noDepartments}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="employeeId" className="mb-1 block text-sm font-medium text-text">
              {strings.employeeId}
            </label>
            <input
              id="employeeId"
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-xl bg-surface-alt px-3 py-2 text-sm text-text"
              placeholder="e.g. EMP001"
            />
            {fieldErrors.employeeId && (
              <p className="mt-1 text-sm text-danger">{fieldErrors.employeeId}</p>
            )}
          </div>
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-text">
              {strings.fullName}
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl bg-surface-alt px-3 py-2 text-sm text-text"
              placeholder=""
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-sm text-danger">{fieldErrors.fullName}</p>
            )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-text">
              {strings.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-surface-alt px-3 py-2 text-sm text-text"
              placeholder="name@company.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-danger">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="department" className="mb-1 block text-sm font-medium text-text">
              {strings.department}
            </label>
            <Select
              id="department"
              value={departmentId}
              onChange={setDepartmentId}
              options={departmentOptions}
              placeholder={strings.departmentPlaceholder}
              searchable={true}
              aria-label={strings.department}
            />
            {fieldErrors.department && (
              <p className="mt-1 text-sm text-danger">{fieldErrors.department}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={loading} className="inline-flex items-center gap-2">
            <Add size={18} color={colors.background} className="shrink-0" />
            {loading ? common.loading : common.add}
          </Button>
          {extraActions && (
            <>
              <span className="text-sm text-text-muted">or</span>
              {extraActions}
            </>
          )}
        </div>
      </form>
    </Card>
  )
}

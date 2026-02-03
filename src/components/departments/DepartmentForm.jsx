import { useState } from 'react'
import { Add } from 'iconsax-react'
import { api } from '../../api/client'
import { colors } from '../../theme'
import { departments as strings, common, validation } from '../../content/strings'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function DepartmentForm({ onAdded, extraActions }) {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  function validate() {
    const errors = {}
    if (!name.trim()) errors.name = validation.required
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    setLoading(true)
    try {
      await api.post('/api/departments', { name: name.trim() })
      setName('')
      setFieldErrors({})
      onAdded?.()
      toast.success(strings.addSuccess)
    } catch (err) {
      const msg = err.message || common.error
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h3 className="mb-4 text-lg font-medium text-text">{strings.formTitle}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="departmentName" className="mb-1 block text-sm font-medium text-text">
            {strings.name}
          </label>
          <input
            id="departmentName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full cursor-pointer rounded-xl bg-surface-alt px-3 py-2 text-sm text-text"
            placeholder={strings.namePlaceholder}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-danger">{fieldErrors.name}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={loading} className="inline-flex cursor-pointer items-center gap-2">
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

import { useRef } from 'react'
import { DocumentUpload } from 'iconsax-react'
import { api } from '../../api/client'
import { colors } from '../../theme'
import { useToast } from '../../context/ToastContext'
import Button from './Button'

export default function BulkImportCsv({ endpoint, onSuccess, label = 'Import CSV', resultMessage }) {
  const inputRef = useRef(null)
  const { toast } = useToast()

  async function handleFile(e) {
    const file = e.target?.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please select a .csv file.')
      return
    }
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await api.post(endpoint, formData)
      const created = result?.created ?? 0
      const failed = result?.failed ?? 0
      if (resultMessage && typeof resultMessage === 'function') {
        toast.success(resultMessage(created, failed))
      } else {
        toast.success(failed > 0 ? `Created ${created}, skipped ${failed}.` : `Created ${created}.`)
      }
      onSuccess?.()
    } catch (err) {
      toast.error(err.message || 'Import failed.')
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        aria-hidden="true"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="secondary"
        className="inline-flex items-center gap-2"
        onClick={() => inputRef.current?.click()}
      >
        <DocumentUpload size={20} color={colors.text} className="shrink-0" />
        {label}
      </Button>
    </>
  )
}

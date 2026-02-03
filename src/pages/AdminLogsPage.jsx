import { useState, useEffect, useMemo } from 'react'
import { DocumentText } from 'iconsax-react'
import { api } from '../api/client'
import { colors } from '../theme'
import { adminLogs as strings } from '../content/strings'
import Table from '../components/ui/Table'
import Pagination, { DEFAULT_PAGE_SIZE } from '../components/ui/Pagination'
import Skeleton from '../components/ui/Skeleton'
import SkeletonTable from '../components/ui/SkeletonTable'
import ErrorMessage from '../components/ui/ErrorMessage'

function formatLogTime(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'medium',
    })
  } catch {
    return iso
  }
}

export default function AdminLogsPage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .get('/api/admin-logs', { limit: 500 })
      .then((data) => {
        if (cancelled) return
        setList(Array.isArray(data) ? data : data?.logs ?? data?.data ?? [])
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load logs.')
          setList([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filteredList = useMemo(() => {
    if (!search.trim()) return list
    const q = search.trim().toLowerCase()
    return list.filter((log) => {
      const action = (log.action || '').toLowerCase()
      const entityType = (log.entityType ?? log.entity_type ?? '').toLowerCase()
      const entityId = (log.entityId ?? log.entity_id ?? '').toLowerCase()
      const details = (log.details || '').toLowerCase()
      return (
        action.includes(q) ||
        entityType.includes(q) ||
        entityId.includes(q) ||
        details.includes(q)
      )
    })
  }, [list, search])

  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredList.slice(start, start + pageSize)
  }, [filteredList, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [search])
  useEffect(() => {
    setPage(1)
  }, [pageSize])

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full max-w-sm rounded-xl" />
          <div className="overflow-hidden rounded-2xl bg-background">
            <SkeletonTable columnCount={4} rowCount={6} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-text sm:text-2xl">
        <DocumentText size={28} color={colors.primary} className="shrink-0" />
        {strings.title}
      </h2>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
          onDismiss={() => setError(null)}
        />
      )}

      <div className="flex flex-col gap-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={strings.searchPlaceholder}
          className="w-full max-w-sm rounded-xl border border-divider bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Search logs"
        />
        <div className="overflow-hidden rounded-2xl border border-divider bg-background">
          <Table
            columns={[
              { key: 'time', label: strings.time },
              { key: 'action', label: strings.action },
              { key: 'entity', label: strings.entity },
              { key: 'details', label: strings.details },
            ]}
            empty={strings.empty}
            isEmpty={filteredList.length === 0}
          >
            {paginatedList.map((log) => (
              <tr key={log.id} className="border-t border-divider">
                <td className="whitespace-nowrap px-4 py-3 text-sm text-text-muted">
                  {formatLogTime(log.createdAt ?? log.created_at)}
                </td>
                <td className="px-4 py-3 text-sm text-text">{log.action ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-text">
                  {log.entityType ?? log.entity_type ?? '—'}
                  {(log.entityId ?? log.entity_id) && (
                    <span className="ml-1 text-xs text-text-muted">({log.entityId ?? log.entity_id})</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-text">{log.details ?? '—'}</td>
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
      </div>
    </div>
  )
}

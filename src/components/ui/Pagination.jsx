import { common } from '../../content/strings'
import Button from './Button'

const DEFAULT_PAGE_SIZE = 25
const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100]

/**
 * Pagination controls. Parent slices the list and passes:
 * - currentPage (1-based)
 * - totalItems (full list length)
 * - pageSize (optional, default 25)
 * - onPageChange(page)
 * - onPageSizeChange(pageSize) (optional)
 */
export default function Pagination({
  currentPage,
  totalItems,
  pageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  className = '',
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const page = Math.max(1, Math.min(currentPage, totalPages))
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  if (totalPages <= 1 && totalItems <= pageSize) return null

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-t border-divider bg-surface-alt/50 px-4 py-3 text-sm text-text-muted ${className}`.trim()}
      role="navigation"
      aria-label="Pagination"
    >
      <div className="order-2 flex flex-wrap items-center gap-3 sm:order-1">
        {typeof onPageSizeChange === 'function' && (
          <label className="inline-flex items-center gap-2">
            <span className="text-sm">{common.paginationRowsPerPage}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const next = Number(e.target.value)
                onPageSizeChange(next)
                onPageChange(1)
              }}
              className="cursor-pointer rounded-xl border border-divider bg-background px-2 py-1 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label={common.paginationRowsPerPage}
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        <span>
          {totalItems > 0
            ? common.paginationShowing(from, to, totalItems)
            : common.paginationPageOf(page, totalPages)}
        </span>
      </div>
      <div className="order-1 flex items-center gap-2 sm:order-2">
        <Button
          variant="secondary"
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="min-w-16"
        >
          {common.paginationPrev}
        </Button>
        <span className="hidden font-medium text-text sm:inline" aria-live="polite">
          {common.paginationPageOf(page, totalPages)}
        </span>
        <Button
          variant="secondary"
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="min-w-16"
        >
          {common.paginationNext}
        </Button>
      </div>
    </div>
  )
}

export { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS }

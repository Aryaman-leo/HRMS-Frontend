import Skeleton from './Skeleton'

/**
 * Table-shaped skeleton: header row + N data rows. Pass columnCount and rowCount (default 5).
 */
export default function SkeletonTable({ columnCount = 4, rowCount = 5 }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-background">
      <table className="w-full min-w-[400px] border-collapse">
        <thead>
          <tr className="bg-surface-alt">
            {Array.from({ length: columnCount }, (_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            <tr key={rowIndex} className="border-t border-divider">
              {Array.from({ length: columnCount }, (_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton
                    className={`h-4 ${colIndex === 0 ? 'w-32' : colIndex === columnCount - 1 ? 'w-16' : 'w-24'}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

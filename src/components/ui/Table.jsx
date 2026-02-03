export default function Table({ columns, children, empty, emptyAction, isEmpty }) {
  const showEmpty = isEmpty && (empty || emptyAction)
  return (
    <div className="overflow-hidden rounded-2xl bg-background">
      {!showEmpty && (
        <table className="w-full min-w-[400px] border-collapse">
          <thead>
            <tr className="bg-surface-alt">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-medium text-text-muted"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children}
          </tbody>
        </table>
      )}
      {showEmpty && (
        <div className="px-4 py-12 text-center text-text-muted">
          <p className="text-sm">{empty}</p>
          {emptyAction && (
            <div className="mt-3">
              {emptyAction}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

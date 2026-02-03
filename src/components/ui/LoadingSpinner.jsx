export default function LoadingSpinner({ className = '' }) {
  return (
    <div
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-surface-alt border-t-primary ${className}`.trim()}
      role="status"
      aria-label="Loading"
    />
  )
}

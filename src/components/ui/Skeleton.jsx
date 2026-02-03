/**
 * Skeleton placeholder for loading states. Use className for size (e.g. h-4 w-32).
 */
export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-alt ${className}`.trim()}
      aria-hidden="true"
    />
  )
}

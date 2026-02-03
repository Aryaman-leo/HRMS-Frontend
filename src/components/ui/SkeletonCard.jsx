import Card from './Card'
import Skeleton from './Skeleton'

/**
 * Card-shaped skeleton: title line + value line + optional subtext. Used for stat cards.
 */
export default function SkeletonCard() {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mt-1" />
        </div>
        <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      </div>
    </Card>
  )
}

import { CloseCircle, Refresh2 } from 'iconsax-react'
import { common } from '../../content/strings'
import { colors } from '../../theme'

const iconSize = 18
const iconColor = colors.danger

export default function ErrorMessage({ message, onRetry, onDismiss }) {
  const text = message || common.error
  return (
    <div
      className="rounded-xl bg-danger-light px-4 py-3 text-danger"
      role="alert"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm">{text}</p>
        <div className="flex shrink-0 items-center gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium hover:bg-danger/10"
            >
              <Refresh2 size={iconSize} color={iconColor} className="shrink-0" />
              {common.retry}
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium hover:bg-danger/10"
            >
              <CloseCircle size={iconSize} color={iconColor} className="shrink-0" />
              {common.cancel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

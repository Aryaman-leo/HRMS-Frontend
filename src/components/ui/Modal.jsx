import { useEffect } from 'react'

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
}) {
  useEffect(() => {
    if (!open) return
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-text/50 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md rounded-2xl bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 id="modal-title" className="border-b border-divider px-6 py-4 text-lg font-semibold text-text">
            {title}
          </h2>
        )}
        <div className="px-6 py-4 text-sm text-text">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-divider px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}

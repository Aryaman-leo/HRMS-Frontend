import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

const TOAST_DURATION = 4000

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, TOAST_DURATION)
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    {
      success: (message) => addToast(message, 'success'),
      error: (message) => addToast(message, 'error'),
      info: (message) => addToast(message, 'info'),
    },
    [addToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext)
  if (!toasts.length) return null
  return (
    <div
      className="fixed top-4 right-4 z-100 flex max-w-sm flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`flex items-center gap-3 rounded-xl  px-4 py-3 text-sm shadow-lg ${
            t.type === 'success'
              ? 'border-success/30 bg-background text-text'
              : t.type === 'error'
                ? 'border-danger/30 bg-danger-light text-danger'
                : 'border-divider bg-background text-text'
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="shrink-0 rounded p-1 hover:opacity-70"
            aria-label="Dismiss"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

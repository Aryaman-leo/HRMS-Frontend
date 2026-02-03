const variants = {
  primary: 'bg-primary text-background hover:bg-primary-light',
  secondary: 'bg-surface-alt text-text hover:bg-surface',
  danger: 'bg-danger-light text-danger hover:bg-danger hover:text-background',
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) {
  const base = 'cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none '
  const variantClass = variants[variant] ?? variants.primary
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

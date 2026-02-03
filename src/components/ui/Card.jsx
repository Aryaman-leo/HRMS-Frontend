export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl bg-background p-6 ${className}`.trim()}>
      {children}
    </div>
  )
}

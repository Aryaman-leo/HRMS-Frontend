import { colors } from '../../theme'

const iconSize = 18
const iconColorActive = colors.primary
const iconColorInactive = colors.textMuted

export default function Tabs({ tabs: tabList, activeTab, onChange, className = '' }) {
  return (
    <div role="tablist" className={`flex gap-1 rounded-xl bg-surface-alt p-1 ${className}`.trim()}>
      {tabList.map((tab) => {
        const isActive = activeTab === tab.value
        const Icon = tab.icon
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={`cursor-pointer flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? 'bg-background text-primary' : 'text-text-muted hover:bg-background/50 hover:text-text'
            }`}
          >
            {Icon && <Icon size={iconSize} color={isActive ? iconColorActive : iconColorInactive} className="shrink-0" />}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

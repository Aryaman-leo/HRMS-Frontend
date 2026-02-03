import { NavLink } from 'react-router-dom'
import { CalendarTick, CloseCircle, People, Buildings2 } from 'iconsax-react'
import { appTitle, nav, tabs } from '../../content/strings'
import { colors } from '../../theme'

const iconSize = 20
const iconColorActive = colors.primary
const iconColorInactive = colors.textMuted

export default function Sidebar({ open = false, onClose }) {
  return (
    <>
      {/* Overlay when sidebar is open (below lg) */}
      <div
        role="presentation"
        onClick={onClose}
        className={`fixed inset-0 z-10 bg-text/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />
      <aside
        className={`fixed left-0 top-0 z-20 flex h-full w-56 flex-col bg-background shadow-xl transition-transform duration-200 ease-out lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Main navigation"
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-4">
          <span className="text-lg font-semibold text-text truncate">{appTitle}</span>
          <button
            type="button"
            onClick={onClose}
            className="flex shrink-0 items-center justify-center rounded-xl p-2 text-text-muted transition-colors hover:bg-surface-alt hover:text-text lg:hidden"
            aria-label="Close menu"
          >
            <CloseCircle size={22} className="shrink-0" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4" onClick={onClose}>
        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-surface-alt text-primary' : 'text-text-muted hover:bg-surface-alt hover:text-text'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <People size={iconSize} color={isActive ? iconColorActive : iconColorInactive} className="shrink-0" />
              {tabs.employeeDatabase}
            </>
          )}
        </NavLink>
        <NavLink
          to="/departments"
          className={({ isActive }) =>
            `flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-surface-alt text-primary' : 'text-text-muted hover:bg-surface-alt hover:text-text'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Buildings2 size={iconSize} color={isActive ? iconColorActive : iconColorInactive} className="shrink-0" />
              {tabs.departments}
            </>
          )}
        </NavLink>
        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-surface-alt text-primary' : 'text-text-muted hover:bg-surface-alt hover:text-text'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <CalendarTick size={iconSize} color={isActive ? iconColorActive : iconColorInactive} className="shrink-0" />
              {nav.attendance}
            </>
          )}
        </NavLink>
      </nav>
    </aside>
    </>
  )
}

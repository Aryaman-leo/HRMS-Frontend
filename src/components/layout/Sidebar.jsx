import { NavLink } from 'react-router-dom'
import { Home2, CalendarTick, People, Buildings2, DocumentText, Code1 } from 'iconsax-react'
import { appTitle, nav, tabs } from '../../content/strings'
import { colors } from '../../theme'

const iconSize = 20
const iconColorActive = colors.primary
const iconColorInactive = colors.textMuted

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 z-10 flex h-full w-56 flex-col bg-background"
      aria-label="Main navigation"
    >
      <div className="flex h-14 shrink-0 items-center gap-3 px-4">
        <img
          src="/logo.svg"
          alt=""
          className="h-9 w-9 shrink-0 rounded-lg object-contain"
          width="36"
          height="36"
        />
        <span className="text-lg font-semibold text-text">{appTitle}</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-surface-alt text-primary' : 'text-text-muted hover:bg-surface-alt hover:text-text'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home2 size={iconSize} color={isActive ? iconColorActive : iconColorInactive} className="shrink-0" />
              {nav.dashboard}
            </>
          )}
        </NavLink>
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
        <NavLink
          to="/admin-logs"
          className={({ isActive }) =>
            `flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-surface-alt text-primary' : 'text-text-muted hover:bg-surface-alt hover:text-text'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Code1 size={iconSize} color={isActive ? iconColorActive : iconColorInactive} className="shrink-0" />
              {nav.adminLogs}
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  )
}

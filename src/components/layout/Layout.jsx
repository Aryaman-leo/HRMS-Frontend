import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { HambergerMenu } from 'iconsax-react'
import { appTitle } from '../../content/strings'
import { colors } from '../../theme'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile/tablet header: visible below lg (1024px) so hamburger is easy to find */}
      <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-divider bg-background px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex shrink-0 items-center justify-center rounded-xl p-2 text-text transition-colors hover:bg-surface-alt hover:text-primary"
          aria-label="Open menu"
        >
          <HambergerMenu size={26} color={colors.text} className="shrink-0" />
        </button>
        <span className="text-lg font-semibold text-text truncate">{appTitle}</span>
      </header>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="pl-0 pt-14 lg:pl-56 lg:pt-0">
        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

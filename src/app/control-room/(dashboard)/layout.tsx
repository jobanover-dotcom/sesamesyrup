import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { requireAdminClient } from '@/features/admin/auth'
import { signOut } from '@/features/admin/actions/session'
import adminStyle from './dashboard.module.css'

export const metadata: Metadata = {
  title: 'Control Room',
  robots: { index: false, follow: false },
}

/**
 * Guarded dashboard chrome. This layout is the authoritative auth boundary:
 * every dashboard page renders only after requireAdminClient() passes.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const client = await requireAdminClient()
  const {
    data: { user },
  } = await client.auth.getUser()

  return (
    <div className={adminStyle.shell}>
      <AdminSidebar email={user?.email ?? null} />
      <div className={adminStyle.main}>
        <header className={adminStyle.topbar}>
          <span className={adminStyle.chip} aria-hidden={true}>
            Private area
          </span>
          <form action={signOut}>
            <button type="submit" className={adminStyle.logout}>
              Logout
            </button>
          </form>
        </header>
        <main id="main" className={adminStyle.content}>
          {children}
        </main>
      </div>
    </div>
  )
}

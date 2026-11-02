'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BadgeCheck,
  Boxes,
  ExternalLink,
  FolderOpen,
  Gauge,
  Layers,
  Settings,
  Shapes,
  SquareArrowOutUpRight,
  UserRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import adminStyle from '../admin-sidebar.module.css'

const NAV = [
  { href: '/control-room', label: 'Overview', icon: Gauge, exact: true },
  { href: '/control-room/projects', label: 'Projects', icon: FolderOpen },
  { href: '/control-room/categories', label: 'Project Categories', icon: Boxes },
  { href: '/control-room/technologies', label: 'Technologies', icon: Shapes },
  { href: '/control-room/certificates', label: 'Certificates', icon: BadgeCheck },
  { href: '/control-room/profile', label: 'Profile Information', icon: UserRound },
  { href: '/control-room/social', label: 'Social Links', icon: Layers },
  { href: '/control-room/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname()

  return (
    <aside className={adminStyle.sidebar} aria-label="Admin navigation">
      <div className={adminStyle.brand}>
        <Link href="/control-room" className={adminStyle.brandLink}>
          Control Room
        </Link>
        <span className={adminStyle.email}>{email ?? ''}</span>
      </div>

      <nav className={adminStyle.nav} aria-label="Admin sections">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(adminStyle.item, active && adminStyle.itemActive)}
            >
              <Icon size={15} aria-hidden={true} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className={adminStyle.extra}>
        <Link href="/" target="_blank" rel="noreferrer" className={adminStyle.item}>
          <ExternalLink size={15} aria-hidden={true} /> View Public Portfolio
          <SquareArrowOutUpRight size={11} aria-hidden={true} className={adminStyle.extArrow} />
        </Link>
      </div>
    </aside>
  )
}

import Link from 'next/link'
import { requireAdminClient } from '@/features/admin/auth'
import { countAdmin } from '@/features/admin/repository'
import ui from '@/features/admin/ui.module.css'
import shared from '@/features/admin/components/overview.module.css'

export default async function OverviewPage() {
  const client = await requireAdminClient()
  const [projectCount, certificateCount, technologyCount, categoryCount] = await Promise.all([
    countAdmin(client, 'projects'),
    countAdmin(client, 'certificates'),
    countAdmin(client, 'technologies'),
    countAdmin(client, 'categories'),
  ])

  const quickLinks = [
    { href: '/control-room/projects', label: 'Manage projects' },
    { href: '/control-room/categories', label: 'Manage categories' },
    { href: '/control-room/technologies', label: 'Manage technologies' },
    { href: '/control-room/certificates', label: 'Manage certificates' },
    { href: '/control-room/profile', label: 'Edit profile' },
    { href: '/control-room/social', label: 'Edit social links' },
  ]

  return (
    <>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Overview</h1>
        <span className={ui.pageSubtitle}>Content inventory</span>
      </div>

      <div className={ui.stats}>
        <div className={ui.statCard}>
          <span className={shared.label}>Projects</span>
          <span className={ui.statValue}>{projectCount}</span>
        </div>
        <div className={ui.statCard}>
          <span className={shared.label}>Certificates</span>
          <span className={ui.statValue}>{certificateCount}</span>
        </div>
        <div className={ui.statCard}>
          <span className={shared.label}>Technologies</span>
          <span className={ui.statValue}>{technologyCount}</span>
        </div>
        <div className={ui.statCard}>
          <span className={shared.label}>Categories</span>
          <span className={ui.statValue}>{categoryCount}</span>
        </div>
      </div>

      <div className={ui.sectionBlock}>
        <h2 className={ui.sectionTitle}>Quick links</h2>
        <ul className={shared.quickList}>
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={shared.quickLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

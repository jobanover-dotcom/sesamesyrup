import Link from 'next/link'
import { ArrowUp } from 'lucide-react'
import type { SocialLink } from '@/features/portfolio/types'
import styles from './Footer.module.css'

/** Editorial colophon footer. */
export function Footer({
  name,
  socialLinks,
}: {
  name: string
  socialLinks: SocialLink[]
}) {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.mast}>
          <span className={styles.name}>{name}</span>
          <span className={styles.rule} aria-hidden="true" />
          <span className={styles.year}>© {year}</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.cell}>
            <p className={styles.label}>Elsewhere</p>
            <ul className={styles.links}>
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.url} target="_blank" rel="noreferrer noopener">
                    {link.platform}
                  </a>
                </li>
              ))}
              {socialLinks.length === 0 ? <li className={styles.hint}>Not linked yet</li> : null}
            </ul>
          </div>

          <div className={styles.cell}>
            <p className={styles.label}>Site</p>
            <ul className={styles.links}>
              <li>
                <Link href="/#about">About</Link>
              </li>
              <li>
                <Link href="/#projects">Projects</Link>
              </li>
              <li>
                <Link href="/#certificates">Certificates</Link>
              </li>
              <li>
                <Link href="/#contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className={styles.cell}>
            <p className={styles.label}>Colophon</p>
            <p className={styles.colophon}>
              Set in Instrument Serif &amp; Geist. Built with Next.js,
              Supabase and CSS Modules.
            </p>
          </div>

          <div className={styles.cell}>
            <p className={styles.label}>Navigation</p>
            <a href="#about" className={styles.top}>
              <ArrowUp size={14} aria-hidden={true} />
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

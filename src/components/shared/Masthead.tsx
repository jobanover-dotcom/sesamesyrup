'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { cn } from '@/lib/utils'
import styles from './Masthead.module.css'

export type NavItem = { href: string; label: string }

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#technologies', label: 'Technologies' },
  { href: '/#certificates', label: 'Certificates' },
  { href: '/#contact', label: 'Contact' },
]

/**
 * Editorial masthead. Floating glass bar after scroll; plain transparent
 * frame at top of page. No admin entry point is ever rendered here.
 */
export function Masthead({ brand }: { brand: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const initials = brand ? brand.slice(0, 2).toUpperCase() : ''

  return (
    <nav
      className={cn(styles.masthead, scrolled && styles.scrolled)}
      aria-label="Primary"
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.monogram} aria-hidden="true">
            {initials}
          </span>
          <span className={styles.brandName}>{brand || 'Portfolio'}</span>
        </Link>

        <div className={styles.links}>
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="masthead-mobile"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={18} aria-hidden={true} /> : <Menu size={18} aria-hidden={true} />}
        </button>
      </div>

      <div id="masthead-mobile" className={styles.drawer} hidden={!open}>
        {PUBLIC_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.drawerLink}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <div className={styles.drawerFooter}>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

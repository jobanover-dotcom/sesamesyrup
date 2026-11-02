'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { MoonStar, Sun } from 'lucide-react'
import styles from './ThemeToggle.module.css'

const emptySubscribe = () => () => {}

/**
 * Monochrome theme switch. Persists via next-themes (localStorage). The
 * resolved state is only read after mount so the server-rendered markup and
 * the first client render agree (no hydration mismatch); before mount the
 * dark default from the server is used.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const isDark = mounted ? (resolvedTheme ?? 'dark') !== 'light' : true
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
      suppressHydrationWarning
    >
      {isDark ? <Sun size={15} aria-hidden={true} /> : <MoonStar size={15} aria-hidden={true} />}
      <span className={styles.label} suppressHydrationWarning>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}

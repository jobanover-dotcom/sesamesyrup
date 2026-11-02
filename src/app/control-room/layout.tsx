import type { ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

/**
 * The control room is a separate area of the same app. Fonts are local
 * (offline-safe) and the dark theme must hold here, independent of the
 * visitor's public-site theme choice.
 */
export default function ControlRoomRootLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`}
      style={{ color: 'var(--text)', background: 'var(--bg)', minHeight: '100svh' }}
    >
      {children}
    </div>
  )
}

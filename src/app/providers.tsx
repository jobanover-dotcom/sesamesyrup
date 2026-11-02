'use client'

import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      scriptProps={{
        // React 19 warns when a client component renders an inline <script>;
        // the documented pattern is to vary the script type between server
        // ("text/javascript") and client ("text/plain") and keep
        // suppressHydrationWarning on the element so hydration accepts the
        // server-rendered script.
        type: typeof window === 'undefined' ? 'text/javascript' : 'text/plain',
      }}
    >
      {children}
    </ThemeProvider>
  )
}

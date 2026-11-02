'use client'

import { useEffect } from 'react'
import NextError from 'next/error'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app] global error boundary', error)
  }, [error])

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextError statusCode={500} title="Something went wrong" />
        <div style={{ position: 'fixed', bottom: '1rem', right: '1rem' }}>
          <button type="button" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

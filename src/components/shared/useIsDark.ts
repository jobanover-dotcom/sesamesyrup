'use client'

import { useTheme } from 'next-themes'

/**
 * Standalone theme switch used in the colophon footer and project pages,
 * where the full masthead is not rendered.
 */
export function useIsDark(): boolean {
  const { theme } = useTheme()
  return theme !== 'light'
}

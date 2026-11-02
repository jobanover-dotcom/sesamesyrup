/**
 * Centralised public (publishable) Supabase configuration lookup.
 * These values are safe for the browser; the service-role key must never
 * appear here — it is not used anywhere in this application.
 */

export type SupabaseClientConfig = {
  url: string
  anonKey: string
}

export function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  )
}

/** Returns null instead of throwing so routes can degrade gracefully. */
export function getSupabaseClientConfig(): SupabaseClientConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !anonKey) return null
  return { url, anonKey }
}

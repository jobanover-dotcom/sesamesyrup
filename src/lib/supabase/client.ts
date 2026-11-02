import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseClientConfig } from './config'

export type SupabaseBrowserClient = SupabaseClient

/**
 * Browser-side Supabase client using the publishable key.
 * Returns null when Supabase is not configured; admin flows surface a clear
 * setup error instead of throwing.
 */
export function createClient(): SupabaseBrowserClient | null {
  const environment = getSupabaseClientConfig()
  if (!environment) return null
  return createBrowserClient(environment.url, environment.anonKey)
}

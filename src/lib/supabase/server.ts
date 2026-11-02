import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getSupabaseClientConfig } from './config'

export type SupabaseServerClient = SupabaseClient

/**
 * Server-side Supabase client bound to the Next.js cookie store.
 * Returns null when Supabase is not configured, letting callers degrade
 * gracefully instead of crashing the route.
 */
export async function createClient(): Promise<SupabaseServerClient | null> {
  const environment = getSupabaseClientConfig()
  if (!environment) return null
  const store = await cookies()
  return createServerClient(environment.url, environment.anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) => store.set(name, value, options))
        } catch {
          /* Proxy owns refresh writes. */
        }
      },
    },
  })
}

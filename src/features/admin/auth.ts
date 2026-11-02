import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { SupabaseServerClient } from '@/lib/supabase/server'

const LOGIN_URL = '/control-room/login'

/**
 * Returns a Supabase client bound to a user who is BOTH authenticated and
 * listed in the admins table (server-side authorisation via the is_admin()
 * security-definer SQL function). Otherwise redirects. Never trust the UI.
 */
export async function requireAdminClient(): Promise<SupabaseServerClient> {
  if (!isSupabaseConfigured()) redirect(`${LOGIN_URL}?error=setup`)

  const client = await createClient()
  if (!client) redirect(`${LOGIN_URL}?error=setup`)

  const { data: claims, error: claimsError } = await client.auth.getClaims()
  if (claimsError || !claims?.claims?.sub) redirect(`${LOGIN_URL}?error=forbidden`)

  const { data: isAdmin, error: adminError } = await client.rpc('is_admin')
  if (adminError || isAdmin !== true) redirect(`${LOGIN_URL}?error=forbidden`)

  return client
}

/** Non-throwing variant used by the dashboard layout when unauthenticated. */
export async function getCurrentAdminState(): Promise<SupabaseServerClient | null> {
  if (!isSupabaseConfigured()) return null
  const client = await createClient()
  if (!client) return null
  const { data: isAdmin, error } = await client.rpc('is_admin')
  if (error || isAdmin !== true) return null
  return client
}

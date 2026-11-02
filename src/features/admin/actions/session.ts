'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

const LOGIN_URL = '/control-room/login'

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) redirect(`${LOGIN_URL}?error=missing_credentials`)

  if (!isSupabaseConfigured()) redirect(`${LOGIN_URL}?error=setup`)

  const supabase = await createClient()
  if (!supabase) redirect(`${LOGIN_URL}?error=setup`)

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect(`${LOGIN_URL}?error=invalid_credentials`)

  // Authorisation is enforced here, not just in middleware: only accounts
  // listed in the admins table may proceed.
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin')
  if (adminError || isAdmin !== true) {
    await supabase.auth.signOut()
    redirect(`${LOGIN_URL}?error=forbidden`)
  }

  redirect('/control-room')
}

export async function signOut() {
  if (!isSupabaseConfigured()) redirect(LOGIN_URL)
  const supabase = await createClient()
  if (supabase) await supabase.auth.signOut()
  redirect(LOGIN_URL)
}

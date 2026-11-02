import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const destination = new URL('/control-room', request.url)
  if (!code) return NextResponse.redirect(destination)

  const supabase = await createClient()
  if (!supabase) return NextResponse.redirect(destination)

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) destination.searchParams.set('authError', 'callback_failed')
  return NextResponse.redirect(destination)
}

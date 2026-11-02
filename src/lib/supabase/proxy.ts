import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseClientConfig } from './config'

/**
 * Refreshes the Supabase session cookie on every matched request and keeps
 * the admin route guard cheap: unauthenticated /control-room traffic is
 * redirected straight to the login page.
 */
export async function updateSession(request: NextRequest) {
  const url = new URL(request.url)
  const protectedPath = url.pathname.startsWith('/control-room')

  const environment = getSupabaseClientConfig()
  if (!environment) {
    return protectedPath
      ? NextResponse.redirect(new URL('/control-room/login?error=setup', request.url))
      : NextResponse.next()
  }

  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    environment.url,
    environment.anonKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (values) => {
          values.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          values.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data } = await supabase.auth.getClaims()
  const authenticated = Boolean(data?.claims?.sub)
  const loggingIn = url.pathname.startsWith('/control-room/login')

  if (protectedPath && !loggingIn && !authenticated) {
    return NextResponse.redirect(new URL('/control-room/login', request.url))
  }
  if (loggingIn && authenticated) {
    return NextResponse.redirect(new URL('/control-room', request.url))
  }

  return response
}

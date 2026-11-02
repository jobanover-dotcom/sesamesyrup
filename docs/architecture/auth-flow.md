# Authentication Flow

## Generated Supabase SSR flow

1. Browser code uses `src/lib/supabase/client.ts` with the publishable key.
2. Server code uses the cookie-aware client in `src/lib/supabase/server.ts`.
3. `src/proxy.ts` refreshes/verifies with `getClaims()` and synchronizes request and response cookies.
4. The PKCE callback exchanges an authorization code and redirects only to the application root.
5. Every server operation authorizes again near data access; RLS is the final row boundary.

Proxy is not authorization. Never authorize from `getSession()` alone. See `playbooks/capabilities/supabase/nextjs.md`.

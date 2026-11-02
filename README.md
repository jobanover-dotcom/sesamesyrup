# sesamesyrup

> Job Añover — personal portfolio

Personal portfolio platform: a Classic × Modern editorial public site plus a private
authenticated control-room CMS, backed by Supabase (PostgreSQL, Auth, Storage) and
Formspree for contact delivery.

## Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **Styling:** CSS Modules with design-token CSS variables (dark-first, `[data-theme]`)
- **Backend:** Supabase (PostgreSQL + Auth + Storage) via `@supabase/ssr` server client
- **Forms:** Formspree (browser POST from the public contact form)
- **Icons:** lucide-react (single-tone, no remote icon requests)
- **Fonts:** Geist (local, offline-safe), Instrument Serif (next/font/google)

## Commands

```bash
cp .env.example .env.local
npm install
npm run dev
```

Validate:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes (for CMS) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes (for CMS) | Supabase publishable key |
| `FORMSPREE_ENDPOINT` | yes (for contact) | Formspree form endpoint (e.g. `https://formspree.io/f/xxxx`) |
| `NEXT_PUBLIC_SITE_URL` | recommended | Public base URL (canonical URLs, sitemap) |

The public site degrades gracefully (empty content + fallback copy) when Supabase is
not configured, so the build and basic rendering work without secrets. The CMS
redirects unauthenticated traffic to login when Supabase is unconfigured.

Never commit real credentials. Never add a service-role key to the browser bundle.

## Supabase setup

1. Create a Supabase project (cloud or local via `supabase start`).
2. Apply migrations:

   ```bash
   supabase migration list   # verify new migration appears
   supabase db reset          # fresh local stack (applies migrations in order)
   ```

   Migrations live in `supabase/migrations/00000000000001_portfolio.sql` and include
   RLS policies, storage bucket (`media`), triggers, and seed rows.

3. Storage bucket: `media` (public read; admin write policies gated by the
   `public.is_admin()` security-definer function).

4. First admin account (see `docs/guides/setup.md` for the full procedure):
   create a user in Supabase Auth, then insert their auth user id into
   `public.admins`.

5. Regenerate database types when the local stack is running:

   ```bash
   npm run supabase:types
   ```

## Public routes

- `/` — homepage: hero with light-field, marquee, projects, technologies, certificates, contact, footer.
- `/projects/[slug]` — SEO-friendly shareable project page.

## Admin routes

- `/control-room` — dashboard shell (guarded).
- `/control-room/login` — sign-in.
- `/control-room/{overview,projects,categories,technologies,certificates,profile,social,settings}`.

Admin routes are never linked from the public site. They are additionally protected by
the Supabase proxy matcher (`src/proxy.ts`) and server-side `requireAdminClient()`.

## Deployment

- `npm run build` produces a standalone Next.js output (`output: 'standalone'`).
- Deploy to Vercel; set the environment variables above.
- Ensure `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are
  present in production.

## Architecture

See `docs/architecture/` and `docs/guides/` for schema, auth flow, endpoints, and
deployment details.

# Local Setup Guide

## Prerequisites

- Node.js 24
- npm
- Supabase CLI via the pinned npm package (`supabase` in devDependencies).

## Install and start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Start the local Supabase stack:

```bash
npm run supabase:start
```

## Database

Apply the portfolio migration:

```bash
supabase db reset
```

The migration adds content tables with RLS, the `media` storage bucket with admin
policies, `public.is_admin()`, and seed content.

## First administrator

1. Create a user via Supabase Auth (dashboard → Authentication → Users, or CLI).
2. Insert their auth user id into `public.admins`.
3. Sign in at `/control-room/login`.

Detailed SQL snippets live in `docs/guides/setup.md` → first admin, and in
`supabase/migrations/00000000000001_portfolio.sql` header comments.

## Validate

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

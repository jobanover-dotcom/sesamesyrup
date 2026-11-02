# CONTEXT.md

## Project
**Name:** sesamesyrup
**Description:** My portfolio
**Stack:** nextjs-supabase
**Styling:** CSS_MODULES
**Compatibility profile:** 2026.09
**Year:** 2026

## Goals
- Classic × Modern editorial personal portfolio (Instrument Serif display + Geist UI/mono, monochrome token system).
- Public portfolio fully database-driven (profile, projects, categories, technologies, certificates, social, settings).
- Private admin CMS at `/control-room` via Supabase Auth, RLS and storage policies.

## Key Decisions
- Dark-first design with true inverse light mode via `[data-theme]` tokens in `src/styles/tokens.css`.
- Signature animation: drifting grayscale light-field (canvas, pauses offscreen/tab-hidden/reduced-motion).
- Admin writes use server actions + Supabase RLS (`public.is_admin()` security definer function).
- Content reads use feature repositories with graceful degradation when Supabase env is missing.
- Supabase types: library default generic + hand-normalised mappers (regenerate via `supabase gen types` when stack is available).

## Out of Scope
- Custom email backend (Formspree only).
- Multi-tenant content (single portfolio owner).
- Image CDN beyond Supabase Storage.

## Notes
- Admin route is not publicly linked; still protected by proxy + server actions.
- No local Supabase runtime in this environment (Docker unavailable); production backend is hosted Supabase.

## Expected Concerns (advisory)
- validation
- query
- state
- env
- url-state
- safe-action
- dark-mode


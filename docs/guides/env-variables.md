# Environment Variables

Copy `.env.example` to `.env.local` and fill in real values.

| Variable | Required | Type | Description | Used by |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public CMS | `string` | Supabase project URL, e.g. `https://<ref>.supabase.co`. | Public + Admin client factories |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public CMS | `string` | Supabase publishable (anon) key. | Public + Admin client factories |
| `FORMSPREE_ENDPOINT` | Contact | `string` | Formspree endpoint, e.g. `https://formspree.io/f/abcd` | Public contact form |
| `NEXT_PUBLIC_SITE_URL` | SEO | `string` | Public base URL used for canonical/OG metadata and sitemap, e.g. `https://example.com`. | Metadata/sitemap |

## Security rules

- Never commit real values; never add `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Server-only variables (such as a future service role key) must never appear in
  `NEXT_PUBLIC_*` prefixed variables.
- The contact form intentionally posts directly to Formspree — no custom email backend.

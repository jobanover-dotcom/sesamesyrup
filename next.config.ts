import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    // Supabase Storage hosts are provided by the authenticated admin; the
    // wildcard accepts any https host and the explicit localhost entry covers
    // local Supabase (127.0.0.1:54321). Next.js still requires explicit entries.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '54321' },
    ],
  },
  async headers() { return [{ source: '/(.*)', headers: securityHeaders }] },
}

export default nextConfig

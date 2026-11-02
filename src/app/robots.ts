import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://example.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/control-room', '/control-room/*', '/auth/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}

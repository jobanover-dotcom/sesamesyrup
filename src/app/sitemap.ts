import type { MetadataRoute } from 'next'
import { getAllProjectSlugs, getSettings } from '@/features/portfolio/repository'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings()
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://example.com'

  const entries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
  void settings.title

  for (const slug of await getAllProjectSlugs()) {
    entries.push({
      url: `${base}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }
  return entries
}

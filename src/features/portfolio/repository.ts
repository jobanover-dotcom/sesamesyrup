import 'server-only'
import type { Database } from '@/types/database.types'
import { createClient, type SupabaseServerClient } from '@/lib/supabase/server'
import {
  mapCertificate,
  mapCategory,
  mapProject,
  mapSocialLink,
  mapTechnology,
  type EmbeddedCategory,
} from './mappers'
import type {
  Category,
  Certificate,
  Profile,
  Project,
  SiteSettings,
  SocialLink,
  Technology,
} from './types'

type ProjectsRow = Database['public']['Tables']['projects']['Row']
type ProjectImagesRow = Database['public']['Tables']['project_images']['Row']
type TechnologiesRow = Database['public']['Tables']['technologies']['Row']

const SETTINGS_DEFAULTS: SiteSettings = {
  title: 'Job Añover — Portfolio',
  description: 'Portfolio of Job Añover.',
  default_theme: 'dark',
}

/** Run a Supabase query that must never break the public page: on failure,
 * log a minimal, secret-free warning and fall back to empty content. */
async function safe<T>(
  label: string,
  fallback: T,
  run: (client: SupabaseServerClient) => Promise<T>,
): Promise<T> {
  let client: SupabaseServerClient | null
  try {
    client = await createClient()
  } catch {
    return fallback
  }
  if (!client) return fallback
  try {
    return await run(client)
  } catch {
    console.warn(`[portfolio] ${label} unavailable; serving fallback content.`)
    return fallback
  }
}

export async function getProfile(): Promise<Profile | null> {
  return safe('profile', null, async (client) => {
    const { data, error } = await client.from('profile').select('*').limit(1).maybeSingle()
    if (error || !data) return null
    return {
      full_name: data.full_name ?? '',
      professional_title: data.professional_title ?? '',
      bio: data.bio ?? '',
      profile_image: data.profile_image ?? null,
      location: data.location ?? null,
      cv_url: data.cv_url ?? null,
    }
  })
}

export async function getSettings(): Promise<SiteSettings> {
  return safe('site_settings', SETTINGS_DEFAULTS, async (client) => {
    const { data, error } = await client.from('site_settings').select('setting_key, setting_value')
    if (error || !data) return SETTINGS_DEFAULTS
    const rows = data as { setting_key: string; setting_value: string }[]
    const values = new Map(rows.map((row) => [row.setting_key, row.setting_value]))
    return {
      title: values.get('portfolio_title') || SETTINGS_DEFAULTS.title,
      description: values.get('seo_description') || SETTINGS_DEFAULTS.description,
      default_theme: values.get('default_theme') || SETTINGS_DEFAULTS.default_theme,
    }
  })
}

export async function getCategories(): Promise<Category[]> {
  return safe('categories', [], async (client) => {
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
    if (error || !data) return []
    return data.map(mapCategory)
  })
}

export async function getTechnologies(): Promise<Technology[]> {
  return safe('technologies', [], async (client) => {
    const { data, error } = await client
      .from('technologies')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
    if (error || !data) return []
    return data.map(mapTechnology)
  })
}

export async function getCertificates(): Promise<Certificate[]> {
  return safe('certificates', [], async (client) => {
    const { data, error } = await client
      .from('certificates')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error || !data) return []
    return data.map(mapCertificate)
  })
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return safe('social_links', [], async (client) => {
    const { data, error } = await client
      .from('social_links')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
    if (error || !data) return []
    return data.map(mapSocialLink)
  })
}

/** Attach technologies to projects via the junction table. */
async function attachTechnologies(
  client: SupabaseServerClient,
  projectIds: number[],
): Promise<Map<number, Technology[]>> {
  const result = new Map<number, Technology[]>()
  if (projectIds.length === 0) return result
  const { data, error } = await client
    .from('project_technologies')
    .select('project_id, technologies(*)')
    .in('project_id', projectIds)
  if (error || !data) return result
  const rows = data as unknown as {
    project_id: number
    technologies: TechnologiesRow
  }[]
  for (const link of rows) {
    if (!link.technologies) continue
    const list = result.get(link.project_id) ?? []
    list.push(mapTechnology(link.technologies))
    result.set(link.project_id, list)
  }
  return result
}

export async function getPublishedProjects(): Promise<Project[]> {
  return safe('projects', [], async (client) => {
    const { data, error } = await client
      .from('projects')
      .select('*, category:categories(*), images:project_images(*)')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error || !data) return []
    const rows = data as unknown as (ProjectsRow & {
      category: EmbeddedCategory
      images: ProjectImagesRow[]
    })[]
    const techByProject = await attachTechnologies(
      client,
      rows.map((row) => row.id),
    )
    return rows.map((row) =>
      mapProject(row, row.category, row.images, techByProject.get(row.id) ?? []),
    )
  })
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return safe(`project:${slug}`, null, async (client) => {
    const { data, error } = await client
      .from('projects')
      .select('*, category:categories(*), images:project_images(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
    if (error || !data) return null
    const row = data as unknown as ProjectsRow & {
      category: EmbeddedCategory
      images: ProjectImagesRow[]
    }
    const techByProject = await attachTechnologies(client, [row.id])
    return mapProject(row, row.category, row.images, techByProject.get(row.id) ?? [])
  })
}

export async function getAllProjectSlugs(): Promise<string[]> {
  return safe('project slugs', [], async (client) => {
    const { data, error } = await client
      .from('projects')
      .select('slug')
      .eq('is_published', true)
    if (error || !data) return []
    const rows = data as { slug: string }[]
    return rows.map((row) => row.slug)
  })
}

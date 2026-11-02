import 'server-only'
import type { Database } from '@/types/database.types'
import type { SupabaseServerClient } from '@/lib/supabase/server'
import type { ProjectInput, CategoryInput, TechnologyInput, CertificateInput, ProfileInput, SocialLinkInput, SettingsInput } from './schemas'

type Client = SupabaseServerClient
type ProjectRow = Database['public']['Tables']['projects']['Insert']

/** Uniform, secret-safe operation result for admin server actions. */
export type AdminResult = { ok: boolean; message: string }

export const ADMIN_OK = (message = 'Saved.'): AdminResult => ({ ok: true, message })
export const ADMIN_FAIL = (message = 'Something went wrong. Try again.'): AdminResult => ({
  ok: false,
  message,
})

function dbError(error: { message: string } | null): AdminResult {
  // Postgrest messages can reveal schema details; log server-side, keep UI generic.
  if (error?.message) console.error(`[admin] database error: ${error.message}`)
  return ADMIN_FAIL('The database rejected the change. Check unique fields and try again.')
}

// ------------------------------------------------------------------ projects

export type AdminProjectRow = {
  id: number
  title: string
  slug: string
  short_description: string
  description: string
  category_id: number | null
  category_name: string | null
  cover_image: string | null
  live_url: string | null
  github_url: string | null
  figma_url: string | null
  other_url: string | null
  project_date: string | null
  is_featured: boolean
  is_published: boolean
  display_order: number
  technology_ids: number[]
  images: { id: number; image_url: string; alt_text: string }[]
}

export async function listAdminProjects(client: Client): Promise<AdminProjectRow[]> {
  const { data, error } = await client
    .from('projects')
    .select('*, category:categories(name), images:project_images(*), links:project_technologies(technology_id)')
    .order('display_order', { ascending: true })
  if (error || !data) {
    console.error(`[admin] list projects failed: ${error?.message ?? 'no data'}`)
    return []
  }
  return data.map((row) => mapAdminProject(row))
}

function mapAdminProject(raw: unknown): AdminProjectRow {
  const row = raw as {
    id: number
    title: string
    slug: string
    short_description: string
    description: string
    category_id: number | null
    category: { name: string } | { name: string }[] | null
    cover_image: string | null
    live_url: string | null
    github_url: string | null
    figma_url: string | null
    other_url: string | null
    project_date: string | null
    is_featured: boolean
    is_published: boolean
    display_order: number
    images: { id: number; image_url: string; alt_text: string }[]
    links: { technology_id: number }[]
  }
  const category = Array.isArray(row.category) ? row.category[0] ?? null : row.category
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    short_description: row.short_description ?? '',
    description: row.description ?? '',
    category_id: row.category_id ?? null,
    category_name: category?.name ?? null,
    cover_image: row.cover_image,
    live_url: row.live_url,
    github_url: row.github_url,
    figma_url: row.figma_url,
    other_url: row.other_url,
    project_date: row.project_date,
    is_featured: row.is_featured,
    is_published: row.is_published,
    display_order: row.display_order,
    technology_ids: (row.links ?? []).map((link) => link.technology_id),
    images: row.images ?? [],
  }
}

export async function createProject(client: Client, input: ProjectInput): Promise<AdminResult> {
  const insert: ProjectRow = {
    title: input.title,
    slug: input.slug,
    short_description: input.short_description,
    description: input.description,
    category_id: numOrNull(input.category_id),
    cover_image: textOrNull(input.cover_image),
    live_url: textOrNull(input.live_url),
    github_url: textOrNull(input.github_url),
    figma_url: textOrNull(input.figma_url),
    other_url: textOrNull(input.other_url),
    project_date: textOrNull(input.project_date),
    is_featured: input.is_featured,
    is_published: input.is_published,
    display_order: input.display_order,
  }
  const { data, error } = await client.from('projects').insert(insert).select('id').single()
  if (error || !data) return dbError(error)
  const projectId = (data as { id: number }).id
  return syncProjectRelations(client, projectId, input)
}

export async function updateProject(
  client: Client,
  id: number,
  input: ProjectInput,
): Promise<AdminResult> {  const update: ProjectRow = {
    title: input.title,
    slug: input.slug,
    short_description: input.short_description,
    description: input.description,
    category_id: numOrNull(input.category_id),
    cover_image: textOrNull(input.cover_image),
    live_url: textOrNull(input.live_url),
    github_url: textOrNull(input.github_url),
    figma_url: textOrNull(input.figma_url),
    other_url: textOrNull(input.other_url),
    project_date: textOrNull(input.project_date),
    is_featured: input.is_featured,
    is_published: input.is_published,
    display_order: input.display_order,
  }
  const { error } = await client.from('projects').update(update).eq('id', id)
  if (error) return dbError(error)
  return syncProjectRelations(client, id, input)
}

async function syncProjectRelations(
  client: Client,
  projectId: number,
  input: ProjectInput,
): Promise<AdminResult> {
  const { error: linkError } = await client
    .from('project_technologies')
    .delete()
    .eq('project_id', projectId)
  if (linkError) return dbError(linkError)

  if (input.tech_ids.length > 0) {
    const uniqueTech = [...new Set(input.tech_ids)]
    const { error: insertError } = await client
      .from('project_technologies')
      .insert(uniqueTech.map((technology_id) => ({ project_id: projectId, technology_id })))
    if (insertError) return dbError(insertError)
  }

  const { error: imageDeleteError } = await client
    .from('project_images')
    .delete()
    .eq('project_id', projectId)
  if (imageDeleteError) return dbError(imageDeleteError)

  const images = input.image_urls.filter((image) => image.url.trim() !== '')
  if (images.length > 0) {
    const { error: imageError } = await client.from('project_images').insert(
      images.map((image, index) => ({
        project_id: projectId,
        image_url: image.url,
        alt_text: image.alt,
        display_order: index,
      })),
    )
    if (imageError) return dbError(imageError)
  }
  return ADMIN_OK()
}

export async function deleteProject(client: Client, id: number): Promise<AdminResult> {
  const { error } = await client.from('projects').delete().eq('id', id)
  if (error) return dbError(error)
  return ADMIN_OK('Project deleted.')
}

export async function setProjectFlag(
  client: Client,
  id: number,
  field: 'is_published' | 'is_featured',
  value: boolean,
): Promise<AdminResult> {
  const { error } = await client
    .from('projects')
    .update({ [field]: value })
    .eq('id', id)
  if (error) return dbError(error)
  return ADMIN_OK()

}

export async function getAdminProject(
  client: Client,
  id: number,
): Promise<AdminProjectRow | null> {
  const { data, error } = await client
    .from('projects')
    .select('*, category:categories(name), images:project_images(*), links:project_technologies(technology_id)')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return null
  return mapAdminProject(data)
}

// ---------------------------------------------------------------- categories

export type AdminCategoryRow = Database['public']['Tables']['categories']['Row']

export async function listAdminCategories(client: Client): Promise<AdminCategoryRow[]> {
  const { data, error } = await client
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
  if (error || !data) return []
  return data
}

export async function createCategory(client: Client, input: CategoryInput): Promise<AdminResult> {
  const { error } = await client.from('categories').insert({
    name: input.name,
    slug: input.slug,
    description: input.description,
    display_order: input.display_order,
  })
  if (error) return dbError(error)
  return ADMIN_OK('Category created.')
}

export async function updateCategory(
  client: Client,
  id: number,
  input: CategoryInput,
): Promise<AdminResult> {
  const { error } = await client
    .from('categories')
    .update({
      name: input.name,
      slug: input.slug,
      description: input.description,
      display_order: input.display_order,
    })
    .eq('id', id)
  if (error) return dbError(error)
  return ADMIN_OK('Category updated.')
}

export async function deleteCategory(client: Client, id: number): Promise<AdminResult> {
  const { error } = await client.from('categories').delete().eq('id', id)
  if (error) return dbError(error)
  return ADMIN_OK('Category deleted.')
}

// -------------------------------------------------------------- technologies

export type AdminTechnologyRow = Database['public']['Tables']['technologies']['Row']

export async function listAdminTechnologies(client: Client): Promise<AdminTechnologyRow[]> {
  const { data, error } = await client
    .from('technologies')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })
  if (error || !data) return []
  return data
}

export async function createTechnology(
  client: Client,
  input: TechnologyInput,
): Promise<AdminResult> {
  const values = technologyValues(input)
  const { error } = await client.from('technologies').insert(values)
  if (error) return dbError(error)
  return ADMIN_OK('Technology created.')
}

export async function updateTechnology(
  client: Client,
  id: number,
  input: TechnologyInput,
): Promise<AdminResult> {
  const { error } = await client.from('technologies').update(technologyValues(input)).eq('id', id)
  if (error) return dbError(error)
  return ADMIN_OK('Technology updated.')
}

function technologyValues(input: TechnologyInput) {
  return {
    name: input.name,
    icon: input.icon,
    category: input.category,
    proficiency: input.proficiency,
    description: input.description,
    display_order: input.display_order,
    is_visible: input.is_visible,
  }
}

export async function deleteTechnology(client: Client, id: number): Promise<AdminResult> {
  const { error } = await client.from('technologies').delete().eq('id', id)
  if (error) return dbError(error)
  return ADMIN_OK('Technology deleted.')
}

// -------------------------------------------------------------- certificates

export type AdminCertificateRow = Database['public']['Tables']['certificates']['Row']

export async function listAdminCertificates(client: Client): Promise<AdminCertificateRow[]> {
  const { data, error } = await client
    .from('certificates')
    .select('*')
    .order('display_order', { ascending: true })
  if (error || !data) return []
  return data
}

export async function createCertificate(
  client: Client,
  input: CertificateInput,
): Promise<AdminResult> {
  const { error } = await client
    .from('certificates')
    .insert(certificateValues(input))
  if (error) return dbError(error)
  return ADMIN_OK('Certificate created.')
}

export async function updateCertificate(
  client: Client,
  id: number,
  input: CertificateInput,
): Promise<AdminResult> {
  const { error } = await client
    .from('certificates')
    .update(certificateValues(input))
    .eq('id', id)
  if (error) return dbError(error)
  return ADMIN_OK('Certificate updated.')
}

function certificateValues(input: CertificateInput) {
  return {
    title: input.title,
    issuer: input.issuer,
    issue_date: textOrNull(input.issue_date),
    credential_id: textOrNull(input.credential_id),
    verification_url: textOrNull(input.verification_url),
    file_url: textOrNull(input.file_url),
    description: input.description,
    is_published: input.is_published,
    display_order: input.display_order,
  }
}

export async function deleteCertificate(client: Client, id: number): Promise<AdminResult> {
  const { error } = await client.from('certificates').delete().eq('id', id)
  if (error) return dbError(error)
  return ADMIN_OK('Certificate deleted.')
}

// ------------------------------------------------------------------- profile

export async function getAdminProfile(client: Client) {
  const { data, error } = await client.from('profile').select('*').limit(1).maybeSingle()
  if (error || !data) return null
  return data
}

export async function updateProfile(client: Client, input: ProfileInput): Promise<AdminResult> {
  const { error } = await client.from('profile').upsert({
    id: 1,
    full_name: input.full_name,
    professional_title: input.professional_title,
    bio: input.bio,
    profile_image: textOrNull(input.profile_image),
    location: textOrNull(input.location),
    cv_url: textOrNull(input.cv_url),
  })
  if (error) return dbError(error)
  return ADMIN_OK('Profile updated.')
}

// -------------------------------------------------------------- social links

export type AdminSocialRow = Database['public']['Tables']['social_links']['Row']

export async function listAdminSocialLinks(client: Client): Promise<AdminSocialRow[]> {
  const { data, error } = await client
    .from('social_links')
    .select('*')
    .order('display_order', { ascending: true })
  if (error || !data) return []
  return data
}

export async function createSocialLink(
  client: Client,
  input: SocialLinkInput,
): Promise<AdminResult> {
  const { error } = await client.from('social_links').insert({
    platform: input.platform,
    url: input.url,
    display_order: input.display_order,
    is_visible: input.is_visible,
  })
  if (error) return dbError(error)
  return ADMIN_OK('Link added.')
}

export async function updateSocialLink(
  client: Client,
  id: number,
  input: SocialLinkInput,
): Promise<AdminResult> {
  const { error } = await client
    .from('social_links')
    .update({
      platform: input.platform,
      url: input.url,
      display_order: input.display_order,
      is_visible: input.is_visible,
    })
    .eq('id', id)
  if (error) return dbError(error)
  return ADMIN_OK('Link updated.')
}

export async function deleteSocialLink(client: Client, id: number): Promise<AdminResult> {
  const { error } = await client.from('social_links').delete().eq('id', id)
  if (error) return dbError(error)
  return ADMIN_OK('Link deleted.')
}

// ------------------------------------------------------------------ settings

export async function listAdminSettings(client: Client) {
  const { data, error } = await client
    .from('site_settings')
    .select('setting_key, setting_value')
  if (error || !data) return []
  return data as { setting_key: string; setting_value: string }[]
}

export async function updateSettings(client: Client, input: SettingsInput): Promise<AdminResult> {
  const rows = [
    { setting_key: 'portfolio_title', setting_value: input.portfolio_title },
    { setting_key: 'seo_description', setting_value: input.seo_description },
    { setting_key: 'default_theme', setting_value: input.default_theme },
  ]
  const { error } = await client.from('site_settings').upsert(rows, {
    onConflict: 'setting_key',
  })
  if (error) return dbError(error)
  return ADMIN_OK('Settings saved.')
}

export async function countAdmin(
  client: Client,
  table: 'projects' | 'certificates' | 'technologies' | 'categories',
): Promise<number> {
  const { count, error } = await client.from(table).select('*', { count: 'exact', head: true })
  if (error) {
    console.error(`[admin] count ${table} failed: ${error.message}`)
    return 0
  }
  return count ?? 0
}

// ------------------------------------------------------------------- helpers

function textOrNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function numOrNull(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed === '') return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

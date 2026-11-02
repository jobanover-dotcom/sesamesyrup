import type { Database } from '@/types/database.types'
import type {
  Category,
  Certificate,
  Project,
  ProjectImage,
  SocialLink,
  Technology,
} from './types'

type ProjectsRow = Database['public']['Tables']['projects']['Row']
type CategoriesRow = Database['public']['Tables']['categories']['Row']
type TechnologiesRow = Database['public']['Tables']['technologies']['Row']
type ProjectImagesRow = Database['public']['Tables']['project_images']['Row']
type CertificatesRow = Database['public']['Tables']['certificates']['Row']
type SocialLinksRow = Database['public']['Tables']['social_links']['Row']

export function mapCategory(row: CategoriesRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    display_order: row.display_order ?? 0,
  }
}

export function mapTechnology(row: TechnologiesRow): Technology {
  return {
    id: row.id,
    name: row.name,
    icon: (row.icon ?? '') as Technology['icon'],
    category: row.category ?? 'Other Technologies',
    proficiency: row.proficiency ?? null,
    description: row.description ?? '',
    display_order: row.display_order ?? 0,
    is_visible: row.is_visible ?? true,
  }
}

export function mapProjectImage(row: ProjectImagesRow): ProjectImage {
  return {
    id: row.id,
    project_id: row.project_id,
    image_url: row.image_url ?? '',
    alt_text: row.alt_text ?? '',
    display_order: row.display_order ?? 0,
  }
}

export type EmbeddedCategory = CategoriesRow | CategoriesRow[] | null

export function mapProject(
  row: ProjectsRow,
  category: EmbeddedCategory,
  images: ProjectImagesRow[],
  technologies: Technology[],
): Project {
  const singleCategory = Array.isArray(category) ? (category[0] ?? null) : category
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    short_description: row.short_description ?? '',
    description: row.description ?? '',
    category_id: row.category_id ?? null,
    category: singleCategory ? mapCategory(singleCategory) : null,
    cover_image: row.cover_image ?? null,
    live_url: row.live_url ?? null,
    github_url: row.github_url ?? null,
    figma_url: row.figma_url ?? null,
    other_url: row.other_url ?? null,
    project_date: row.project_date ?? null,
    is_featured: row.is_featured ?? false,
    is_published: row.is_published ?? false,
    display_order: row.display_order ?? 0,
    images: (images ?? []).map(mapProjectImage).sort((a, b) => a.display_order - b.display_order),
    technologies,
  }
}

export function mapCertificate(row: CertificatesRow): Certificate {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer ?? '',
    issue_date: row.issue_date ?? null,
    credential_id: row.credential_id ?? null,
    verification_url: row.verification_url ?? null,
    file_url: row.file_url ?? null,
    description: row.description ?? '',
    is_published: row.is_published ?? false,
    display_order: row.display_order ?? 0,
  }
}

export function mapSocialLink(row: SocialLinksRow): SocialLink {
  return {
    id: row.id,
    platform: row.platform ?? '',
    url: row.url ?? '',
    display_order: row.display_order ?? 0,
    is_visible: row.is_visible ?? true,
  }
}

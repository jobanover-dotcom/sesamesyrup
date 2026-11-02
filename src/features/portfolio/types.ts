/** Icon key list for technologies. Keys map to lucide-react icons so the
 * monochrome single-tone requirement holds and no remote icon requests
 * are needed. */
export const TECH_ICON_KEYS = [
  'code',
  'terminal',
  'braces',
  'layout',
  'palette',
  'database',
  'server',
  'cloud',
  'pen-tool',
  'layers',
  'figma',
  'git',
  'container',
  'shapes',
  'wrench',
  'monitor',
  'box',
] as const

export type IconKey = (typeof TECH_ICON_KEYS)[number]

/** Technology categories used by the public bento grid and admin picker. */
export const TECH_CATEGORIES = [
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Databases',
  'UI/UX Design',
  'Development Tools',
  'Other Technologies',
] as const

export type Category = {
  id: number
  name: string
  slug: string
  description: string
  display_order: number
}

export type Technology = {
  id: number
  name: string
  icon: IconKey
  category: string
  proficiency: number | null
  description: string
  display_order: number
  is_visible: boolean
}

export type ProjectTechnologyLink = {
  technology_id: number
}

export type ProjectImage = {
  id: number
  project_id: number
  image_url: string
  alt_text: string
  display_order: number
}

export type Project = {
  id: number
  title: string
  slug: string
  short_description: string
  description: string
  category_id: number | null
  category: Category | null
  cover_image: string | null
  live_url: string | null
  github_url: string | null
  figma_url: string | null
  other_url: string | null
  project_date: string | null
  is_featured: boolean
  is_published: boolean
  display_order: number
  technologies: Technology[]
  images: ProjectImage[]
}

export type Certificate = {
  id: number
  title: string
  issuer: string
  issue_date: string | null
  credential_id: string | null
  verification_url: string | null
  file_url: string | null
  description: string
  is_published: boolean
  display_order: number
}

export type Profile = {
  full_name: string
  professional_title: string
  bio: string
  profile_image: string | null
  location: string | null
  cv_url: string | null
}

export type SocialLink = {
  id: number
  platform: string
  url: string
  display_order: number
  is_visible: boolean
}

export type SiteSettings = {
  title: string
  description: string
  default_theme: string
}

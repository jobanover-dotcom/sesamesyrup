import { z } from 'zod'
import { TECH_ICON_KEYS } from '@/features/portfolio/types'
import { safeHttpUrl } from '@/lib/utils'

const TECH_CATEGORIES = [
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Databases',
  'UI/UX Design',
  'Development Tools',
  'Other Technologies',
] as const

/** Empty string is allowed (means "no link"). Non-empty must be http(s). */
const optionalHttpUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === '' || safeHttpUrl(value), {
    message: 'Enter a valid http(s) URL.',
  })

const shortText = z.string().trim().max(280)
const mediumText = z.string().trim().max(20000)
const isoDate = z
  .string()
  .trim()
  .refine((value) => value === '' || !Number.isNaN(Date.parse(value)), {
    message: 'Enter a valid date.',
  })

export const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(200),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required.')
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes.'),
  short_description: shortText,
  description: mediumText,
  category_id: z.string().trim(),
  cover_image: optionalHttpUrl,
  live_url: optionalHttpUrl,
  github_url: optionalHttpUrl,
  figma_url: optionalHttpUrl,
  other_url: optionalHttpUrl,
  project_date: isoDate,
  tech_ids: z.array(z.coerce.number().int().positive()).default([]),
  image_urls: z
    .array(
      z.object({
        url: optionalHttpUrl,
        alt: shortText,
      }),
    )
    .max(12)
    .default([]),
  is_featured: z.coerce.boolean().default(false),
  is_published: z.coerce.boolean().default(false),
  display_order: z.coerce.number().int().min(0).max(9999).default(0),
})

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(120),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required.')
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes.'),
  description: shortText,
  display_order: z.coerce.number().int().min(0).max(9999).default(0),
})

export const technologySchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(120),
  icon: z.enum(TECH_ICON_KEYS).or(z.literal('')).default(''),
  category: z.enum(TECH_CATEGORIES),
  proficiency: z
    .union([z.literal(''), z.coerce.number().int().min(0).max(100)])
    .transform((value) => (value === '' ? null : value)),
  description: shortText,
  display_order: z.coerce.number().int().min(0).max(9999).default(0),
  is_visible: z.coerce.boolean().default(true),
})

export const certificateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(240),
  issuer: z.string().trim().max(200),
  issue_date: isoDate,
  credential_id: z.string().trim().max(160),
  verification_url: optionalHttpUrl,
  file_url: optionalHttpUrl,
  description: shortText,
  is_published: z.coerce.boolean().default(true),
  display_order: z.coerce.number().int().min(0).max(9999).default(0),
})

export const profileSchema = z.object({
  full_name: z.string().trim().min(1, 'Name is required.').max(160),
  professional_title: z.string().trim().max(160),
  bio: mediumText,
  profile_image: optionalHttpUrl,
  location: z.string().trim().max(160),
  cv_url: optionalHttpUrl,
})

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, 'Platform is required.').max(80),
  url: optionalHttpUrl.refine((value) => value !== '', 'URL is required.'),
  display_order: z.coerce.number().int().min(0).max(9999).default(0),
  is_visible: z.coerce.boolean().default(true),
})

export const settingsSchema = z.object({
  portfolio_title: z.string().trim().max(160),
  seo_description: z.string().trim().max(300),
  default_theme: z.enum(['dark', 'light']),
})

export type ProjectInput = z.infer<typeof projectSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type TechnologyInput = z.infer<typeof technologySchema>
export type CertificateInput = z.infer<typeof certificateSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type SocialLinkInput = z.infer<typeof socialLinkSchema>
export type SettingsInput = z.infer<typeof settingsSchema>

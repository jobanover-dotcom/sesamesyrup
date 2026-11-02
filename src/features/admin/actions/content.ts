'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminClient } from '../auth'
import {
  createCertificate,
  deleteCertificate,
  updateCertificate,
  createSocialLink,
  deleteSocialLink,
  updateSocialLink,
  updateProfile,
  updateSettings,
  type AdminResult,
} from '../repository'
import {
  certificateSchema,
  profileSchema,
  settingsSchema,
  socialLinkSchema,
} from '../schemas'
import { text, parseFail } from './form'

const ADMIN_BASE = '/control-room'

function revalidateContent() {
  revalidatePath('/')
  revalidatePath(`${ADMIN_BASE}`)
  revalidatePath(`${ADMIN_BASE}/certificates`)
  revalidatePath(`${ADMIN_BASE}/profile`)
  revalidatePath(`${ADMIN_BASE}/social`)
  revalidatePath(`${ADMIN_BASE}/settings`)
}

// -------------------------------------------------------------- certificates

export async function createCertificateAction(formData: FormData): Promise<AdminResult> {
  const parsed = certificateSchema.safeParse({
    title: text(formData, 'title'),
    issuer: text(formData, 'issuer'),
    issue_date: text(formData, 'issue_date'),
    credential_id: text(formData, 'credential_id'),
    verification_url: text(formData, 'verification_url'),
    file_url: text(formData, 'file_url'),
    description: text(formData, 'description'),
    is_published: formData.get('is_published') === 'on',
    display_order: text(formData, 'display_order') || '0',
  })
  if (!parsed.success) return parseFail()
  const client = await requireAdminClient()
  const result = await createCertificate(client, parsed.data)
  if (result.ok) revalidateContent()
  return result
}

export async function updateCertificateAction(
  id: number,
  formData: FormData,
): Promise<AdminResult> {
  const parsed = certificateSchema.safeParse({
    title: text(formData, 'title'),
    issuer: text(formData, 'issuer'),
    issue_date: text(formData, 'issue_date'),
    credential_id: text(formData, 'credential_id'),
    verification_url: text(formData, 'verification_url'),
    file_url: text(formData, 'file_url'),
    description: text(formData, 'description'),
    is_published: formData.get('is_published') === 'on',
    display_order: text(formData, 'display_order') || '0',
  })
  if (!parsed.success) return parseFail()
  const client = await requireAdminClient()
  const result = await updateCertificate(client, id, parsed.data)
  if (result.ok) revalidateContent()
  return result
}

export async function deleteCertificateAction(id: number): Promise<AdminResult> {
  const client = await requireAdminClient()
  const result = await deleteCertificate(client, id)
  if (result.ok) revalidateContent()
  return result
}

// -------------------------------------------------------------- social links

export async function createSocialLinkAction(formData: FormData): Promise<AdminResult> {
  const parsed = socialLinkSchema.safeParse({
    platform: text(formData, 'platform'),
    url: text(formData, 'url'),
    display_order: text(formData, 'display_order') || '0',
    is_visible: formData.get('is_visible') === 'on',
  })
  if (!parsed.success) return parseFail()
  const client = await requireAdminClient()
  const result = await createSocialLink(client, parsed.data)
  if (result.ok) revalidateContent()
  return result
}

export async function updateSocialLinkAction(
  id: number,
  formData: FormData,
): Promise<AdminResult> {
  const parsed = socialLinkSchema.safeParse({
    platform: text(formData, 'platform'),
    url: text(formData, 'url'),
    display_order: text(formData, 'display_order') || '0',
    is_visible: formData.get('is_visible') === 'on',
  })
  if (!parsed.success) return parseFail()
  const client = await requireAdminClient()
  const result = await updateSocialLink(client, id, parsed.data)
  if (result.ok) revalidateContent()
  return result
}

export async function deleteSocialLinkAction(id: number): Promise<AdminResult> {
  const client = await requireAdminClient()
  const result = await deleteSocialLink(client, id)
  if (result.ok) revalidateContent()
  return result
}

// ------------------------------------------------------------------- profile

export async function updateProfileAction(formData: FormData): Promise<AdminResult> {
  const parsed = profileSchema.safeParse({
    full_name: text(formData, 'full_name'),
    professional_title: text(formData, 'professional_title'),
    bio: text(formData, 'bio'),
    profile_image: text(formData, 'profile_image'),
    location: text(formData, 'location'),
    cv_url: text(formData, 'cv_url'),
  })
  if (!parsed.success) {
    console.error('[admin] profile validation failed', parsed.error.issues)
    return parseFail()
  }
  const client = await requireAdminClient()
  const result = await updateProfile(client, parsed.data)
  if (result.ok) revalidateContent()
  return result
}

// ------------------------------------------------------------------ settings

export async function updateSettingsAction(formData: FormData): Promise<AdminResult> {
  const parsed = settingsSchema.safeParse({
    portfolio_title: text(formData, 'portfolio_title'),
    seo_description: text(formData, 'seo_description'),
    default_theme: text(formData, 'default_theme') || 'dark',
  })
  if (!parsed.success) return parseFail()
  const client = await requireAdminClient()
  const result = await updateSettings(client, parsed.data)
  if (result.ok) revalidateContent()
  return result
}

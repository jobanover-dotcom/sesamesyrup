'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminClient } from '../auth'
import {
  createProject,
  deleteProject,
  setProjectFlag,
  updateProject,
  type AdminResult,
} from '../repository'
import { projectSchema } from '../schemas'
import { text, parseFail } from './form'

function revalidateAll() {
  revalidatePath('/')
  revalidatePath('/control-room/projects')
  revalidatePath('/control-room')
}

function readProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    title: text(formData, 'title'),
    slug: text(formData, 'slug'),
    short_description: text(formData, 'short_description'),
    description: text(formData, 'description'),
    category_id: text(formData, 'category_id'),
    cover_image: text(formData, 'cover_image'),
    live_url: text(formData, 'live_url'),
    github_url: text(formData, 'github_url'),
    figma_url: text(formData, 'figma_url'),
    other_url: text(formData, 'other_url'),
    project_date: text(formData, 'project_date'),
    tech_ids: formData.getAll('tech_ids').map(String),
    image_urls: formData
      .getAll('image_url')
      .map(String)
      .map((url, index) => ({
        url,
        alt: String(formData.getAll('image_alt')[index] ?? ''),
      })),
    is_featured: formData.get('is_featured') === 'on',
    is_published: formData.get('is_published') === 'on',
    display_order: text(formData, 'display_order') || '0',
  })
}

export async function createProjectAction(formData: FormData): Promise<AdminResult> {
  const parsed = readProjectForm(formData)
  if (!parsed.success) {
    console.error('[admin] project validation failed', parsed.error.issues)
    return parseFail()
  }
  const client = await requireAdminClient()
  const result = await createProject(client, parsed.data)
  if (result.ok) revalidateAll()
  return result
}

export async function updateProjectAction(
  id: number,
  formData: FormData,
): Promise<AdminResult> {
  const parsed = readProjectForm(formData)
  if (!parsed.success) {
    console.error('[admin] project validation failed', parsed.error.issues)
    return parseFail()
  }
  const client = await requireAdminClient()
  const result = await updateProject(client, id, parsed.data)
  if (result.ok) revalidateAll()
  return result
}

export async function deleteProjectAction(id: number): Promise<AdminResult> {
  const client = await requireAdminClient()
  const result = await deleteProject(client, id)
  if (result.ok) revalidateAll()
  return result
}

export async function toggleProjectPublishedAction(
  id: number,
  value: boolean,
): Promise<AdminResult> {
  const client = await requireAdminClient()
  const result = await setProjectFlag(client, id, 'is_published', value)
  if (result.ok) revalidateAll()
  return result
}

export async function toggleProjectFeaturedAction(
  id: number,
  value: boolean,
): Promise<AdminResult> {
  const client = await requireAdminClient()
  const result = await setProjectFlag(client, id, 'is_featured', value)
  if (result.ok) revalidateAll()
  return result
}

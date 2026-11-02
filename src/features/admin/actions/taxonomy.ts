'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminClient } from '../auth'
import {
  createCategory,
  deleteCategory,
  updateCategory,
  createTechnology,
  deleteTechnology,
  updateTechnology,
  type AdminResult,
} from '../repository'
import { categorySchema, technologySchema } from '../schemas'
import { text, parseFail } from './form'

function revalidateTaxonomies() {
  revalidatePath('/')
  revalidatePath('/control-room')
  revalidatePath('/control-room/categories')
  revalidatePath('/control-room/technologies')
}

// ---------------------------------------------------------------- categories

export async function createCategoryAction(formData: FormData): Promise<AdminResult> {
  const parsed = categorySchema.safeParse({
    name: text(formData, 'name'),
    slug: text(formData, 'slug'),
    description: text(formData, 'description'),
    display_order: text(formData, 'display_order') || '0',
  })
  if (!parsed.success) return parseFail()
  const client = await requireAdminClient()
  const result = await createCategory(client, parsed.data)
  if (result.ok) revalidateTaxonomies()
  return result
}

export async function updateCategoryAction(
  id: number,
  formData: FormData,
): Promise<AdminResult> {
  const parsed = categorySchema.safeParse({
    name: text(formData, 'name'),
    slug: text(formData, 'slug'),
    description: text(formData, 'description'),
    display_order: text(formData, 'display_order') || '0',
  })
  if (!parsed.success) return parseFail()
  const client = await requireAdminClient()
  const result = await updateCategory(client, id, parsed.data)
  if (result.ok) revalidateTaxonomies()
  return result
}

export async function deleteCategoryAction(id: number): Promise<AdminResult> {
  const client = await requireAdminClient()
  const result = await deleteCategory(client, id)
  if (result.ok) revalidateTaxonomies()
  return result
}

// -------------------------------------------------------------- technologies

export async function createTechnologyAction(formData: FormData): Promise<AdminResult> {
  const parsed = technologySchema.safeParse({
    name: text(formData, 'name'),
    icon: text(formData, 'icon'),
    category: text(formData, 'category'),
    proficiency: text(formData, 'proficiency'),
    description: text(formData, 'description'),
    display_order: text(formData, 'display_order') || '0',
    is_visible: formData.get('is_visible') === 'on',
  })
  if (!parsed.success) return parseFail()
  const client = await requireAdminClient()
  const result = await createTechnology(client, parsed.data)
  if (result.ok) revalidateTaxonomies()
  return result
}

export async function updateTechnologyAction(
  id: number,
  formData: FormData,
): Promise<AdminResult> {
  const parsed = technologySchema.safeParse({
    name: text(formData, 'name'),
    icon: text(formData, 'icon'),
    category: text(formData, 'category'),
    proficiency: text(formData, 'proficiency'),
    description: text(formData, 'description'),
    display_order: text(formData, 'display_order') || '0',
    is_visible: formData.get('is_visible') === 'on',
  })
  if (!parsed.success) return parseFail()
  const client = await requireAdminClient()
  const result = await updateTechnology(client, id, parsed.data)
  if (result.ok) revalidateTaxonomies()
  return result
}

export async function deleteTechnologyAction(id: number): Promise<AdminResult> {
  const client = await requireAdminClient()
  const result = await deleteTechnology(client, id)
  if (result.ok) revalidateTaxonomies()
  return result
}

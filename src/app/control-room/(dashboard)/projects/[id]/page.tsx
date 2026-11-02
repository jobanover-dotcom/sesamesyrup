import { notFound } from 'next/navigation'
import { requireAdminClient } from '@/features/admin/auth'
import {
  getAdminProject,
  listAdminCategories,
  listAdminTechnologies,
} from '@/features/admin/repository'
import { ProjectEditorForm } from '@/features/admin/components/ProjectEditorForm'
import ui from '@/features/admin/ui.module.css'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) notFound()

  const client = await requireAdminClient()
  const [project, categories, technologies] = await Promise.all([
    getAdminProject(client, numericId),
    listAdminCategories(client),
    listAdminTechnologies(client),
  ])
  if (!project) notFound()

  return (
    <>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Edit: {project.title}</h1>
        <span className={ui.pageSubtitle}>{project.slug}</span>
      </div>
      <ProjectEditorForm
        project={project}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        technologies={technologies.map((technology) => ({
          id: technology.id,
          name: technology.name,
          category: technology.category,
        }))}
        submitLabel="Save changes"
      />
    </>
  )
}

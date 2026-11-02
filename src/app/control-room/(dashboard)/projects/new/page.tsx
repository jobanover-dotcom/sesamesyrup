import { requireAdminClient } from '@/features/admin/auth'
import { listAdminCategories, listAdminTechnologies } from '@/features/admin/repository'
import { ProjectEditorForm } from '@/features/admin/components/ProjectEditorForm'
import ui from '@/features/admin/ui.module.css'

export default async function NewProjectPage() {
  const client = await requireAdminClient()
  const [categories, technologies] = await Promise.all([
    listAdminCategories(client),
    listAdminTechnologies(client),
  ])

  return (
    <>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>New project</h1>
        <span className={ui.pageSubtitle}>Draft first, publish when ready</span>
      </div>
      <ProjectEditorForm
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        technologies={technologies.map((technology) => ({
          id: technology.id,
          name: technology.name,
          category: technology.category,
        }))}
      />
    </>
  )
}

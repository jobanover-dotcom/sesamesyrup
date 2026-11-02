import Link from 'next/link'
import { requireAdminClient } from '@/features/admin/auth'
import {
  deleteProjectAction,
  toggleProjectFeaturedAction,
  toggleProjectPublishedAction,
} from '@/features/admin/actions/projects'
import { listAdminProjects } from '@/features/admin/repository'
import { ConfirmAction } from '@/features/admin/components/ConfirmAction'
import { RowToggle } from '@/features/admin/components/RowToggle'
import ui from '@/features/admin/ui.module.css'
import page from './projects-page.module.css'

export default async function ProjectsPage() {
  const client = await requireAdminClient()
  const projects = await listAdminProjects(client)

  return (
    <>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Projects</h1>
        <Link href="/control-room/projects/new" className={ui.primaryButton}>
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className={ui.hint}>No projects yet. Create your first project to publish work.</p>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <caption className={ui.visuallyHidden}>All projects</caption>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Category</th>
                <th scope="col">Date</th>
                <th scope="col">Featured</th>
                <th scope="col">Published</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <div>
                      <span className={page.titleCell}>{project.title}</span>
                      <span className={page.slugCell}>/{project.slug}</span>
                    </div>
                    {project.cover_image ? (
                      <span className={page.preview}>cover image saved</span>
                    ) : (
                      <span className={page.previewMissing}>no cover image</span>
                    )}
                  </td>
                  <td>{project.category_name ?? '—'}</td>
                  <td>{project.project_date ?? '—'}</td>
                  <td>
                    <RowToggle
                      action={toggleProjectFeaturedAction.bind(null, project.id)}
                      checked={project.is_featured}
                      labelOn="Featured"
                      labelOff="Standard"
                      title="Toggle featured status"
                    />
                  </td>
                  <td>
                    <RowToggle
                      action={toggleProjectPublishedAction.bind(null, project.id)}
                      checked={project.is_published}
                      labelOn="Published"
                      labelOff="Draft"
                      title="Toggle publish status"
                    />
                  </td>
                  <td>
                    <div className={ui.tableActions}>
                      <Link
                        href={`/control-room/projects/${project.id}`}
                        className={ui.ghostButton}
                      >
                        Edit
                      </Link>
                      <ConfirmAction
                        action={deleteProjectAction.bind(null, project.id)}
                        label="Delete"
                        confirmMessage={`Delete “${project.title}”? This also removes its screenshots and technology links. This cannot be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import {
  createProjectAction,
  updateProjectAction,
} from '@/features/admin/actions/projects'
import { AdminForm } from './AdminForm'
import { SlugField } from './SlugField'
import { FileUploadField } from './FileUploadField'
import { ScreenshotsEditor } from './ScreenshotsEditor'
import { TechMultiSelect } from './TechMultiSelect'
import ui from '../ui.module.css'
import shared from '@/components/ui/ui-shared.module.css'

import type {
  AdminProjectRow,
} from '../repository'

export type CategoryOption = { id: number; name: string }
export type TechnologyOption = { id: number; name: string; category: string }

/**
 * Shared editor for create + edit project flows. Pure server markup; the
 * interactive bits (slug, uploads, tech picker, screenshots) are islands.
 */
export function ProjectEditorForm({
  project,
  categories,
  technologies,
  submitLabel = 'Save project',
}: {
  project?: AdminProjectRow
  categories: CategoryOption[]
  technologies: TechnologyOption[]
  submitLabel?: string
}) {
  return (
    <AdminForm
      action={
        project
          ? updateProjectAction.bind(null, project.id)
          : createProjectAction
      }
      submitLabel={submitLabel}
      footer={
        <Link href="/control-room/projects" className={ui.ghostButton}>
          Cancel
        </Link>
      }
    >
      <input type="hidden" name="form" value="project" />

      {!categories.length ? (
        <p className={ui.errorNote} role="alert">
          <AlertTriangle size={14} aria-hidden={true} />
          No categories exist yet. Create one under Project Categories first.
        </p>
      ) : null}

      <div className={shared.columnGap}>
        <SlugField titleValue={project?.title} slugValue={project?.slug} />

        <div className={ui.field}>
          <label className={ui.label} htmlFor="short_description">
            Short description
          </label>
          <textarea
            id="short_description"
            name="short_description"
            rows={3}
            maxLength={280}
            defaultValue={project?.short_description ?? ''}
            className={ui.textarea}
          />
        </div>

        <div className={ui.field}>
          <label className={ui.label} htmlFor="description">
            Full description
          </label>
          <textarea
            id="description"
            name="description"
            rows={7}
            defaultValue={project?.description ?? ''}
            className={ui.textarea}
          />
        </div>

        <div className={ui.gridTwo}>
          <div className={ui.field}>
            <label className={ui.label} htmlFor="category_id">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={project?.category_id ? String(project.category_id) : ''}
              className={ui.select}
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor="project_date">
              Project date
            </label>
            <input
              id="project_date"
              name="project_date"
              type="date"
              defaultValue={project?.project_date ?? ''}
              className={ui.input}
            />
          </div>
        </div>

        <FileUploadField
          name="cover_image"
          kind="projects"
          label="Cover image (published grayscale, full color on hover)"
          initialValue={project?.cover_image}
        />

        <TechMultiSelect technologies={technologies} selected={project?.technology_ids ?? []} />

        <ScreenshotsEditor
          initial={(project?.images ?? []).map((image) => ({
            url: image.image_url,
            alt: image.alt_text,
          }))}
        />

        <div className={shared.rule} />

        <div className={ui.gridTwo}>
          <div className={ui.field}>
            <label className={ui.label} htmlFor="live_url">
              Live demo URL
            </label>
            <input
              id="live_url"
              name="live_url"
              type="url"
              placeholder="https://"
              defaultValue={project?.live_url ?? ''}
              className={ui.input}
            />
          </div>
          <div className={ui.field}>
            <label className={ui.label} htmlFor="github_url">
              GitHub repository URL
            </label>
            <input
              id="github_url"
              name="github_url"
              type="url"
              placeholder="https://"
              defaultValue={project?.github_url ?? ''}
              className={ui.input}
            />
          </div>
          <div className={ui.field}>
            <label className={ui.label} htmlFor="figma_url">
              Figma file URL
            </label>
            <input
              id="figma_url"
              name="figma_url"
              type="url"
              placeholder="https://"
              defaultValue={project?.figma_url ?? ''}
              className={ui.input}
            />
          </div>
          <div className={ui.field}>
            <label className={ui.label} htmlFor="other_url">
              Other external link
            </label>
            <input
              id="other_url"
              name="other_url"
              type="url"
              placeholder="https://"
              defaultValue={project?.other_url ?? ''}
              className={ui.input}
            />
          </div>
        </div>

        <div className={ui.gridTwo}>
          <div className={ui.field}>
            <label className={ui.label} htmlFor="display_order">
              Display order (lower appears first)
            </label>
            <input
              id="display_order"
              name="display_order"
              type="number"
              min={0}
              defaultValue={project?.display_order ?? 0}
              className={ui.input}
            />
          </div>
          <div className={shared.checkRow}>
            <label className={ui.checkItem}>
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={project?.is_featured ?? false}
              />
              <span>Featured project</span>
            </label>
            <label className={ui.checkItem}>
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={project?.is_published ?? false}
              />
              <span>Published (visible publicly)</span>
            </label>
          </div>
        </div>
      </div>
    </AdminForm>
  )
}

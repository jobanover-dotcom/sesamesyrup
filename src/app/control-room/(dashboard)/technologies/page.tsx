import { requireAdminClient } from '@/features/admin/auth'
import {
  createTechnologyAction,
  deleteTechnologyAction,
  updateTechnologyAction,
} from '@/features/admin/actions/taxonomy'
import { listAdminTechnologies } from '@/features/admin/repository'
import { AdminForm } from '@/features/admin/components/AdminForm'
import { ConfirmAction } from '@/features/admin/components/ConfirmAction'
import { TECH_CATEGORIES, TECH_ICON_KEYS } from '@/features/portfolio/types'
import ui from '@/features/admin/ui.module.css'

export default async function TechnologiesPage() {
  const client = await requireAdminClient()
  const technologies = await listAdminTechnologies(client)

  return (
    <>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Technologies</h1>
        <span className={ui.pageSubtitle}>Monochrome bento grid content</span>
      </div>

      <section aria-label="Create technology" style={{ marginBottom: '2rem' }}>
        <h2 className={ui.sectionTitle}>Create technology</h2>
        <AdminForm action={createTechnologyAction} submitLabel="Create technology">
          <div className={ui.gridTwo}>
            <label className={ui.field}>
              <span className={ui.label}>Name</span>
              <input name="name" type="text" required maxLength={120} className={ui.input} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Category</span>
              <select name="category" required className={ui.select}>
                {TECH_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={ui.gridTwo}>
            <label className={ui.field}>
              <span className={ui.label}>Icon (single-tone)</span>
              <select name="icon" defaultValue="" className={`${ui.select} ${ui.mono}`}>
                <option value="">None</option>
                {TECH_ICON_KEYS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Proficiency (0–100, optional)</span>
              <input
                name="proficiency"
                type="number"
                min={0}
                max={100}
                className={ui.input}
              />
            </label>
          </div>
          <label className={ui.field}>
            <span className={ui.label}>Short description</span>
            <input name="description" type="text" maxLength={280} className={ui.input} />
          </label>
          <div className={ui.gridTwo}>
            <label className={ui.field}>
              <span className={ui.label}>Display order</span>
              <input
                name="display_order"
                type="number"
                min={0}
                defaultValue={technologies.length + 1}
                className={ui.input}
              />
            </label>
            <label className={ui.checkItem}>
              <input type="checkbox" name="is_visible" defaultChecked />
              <span>Visible on public site</span>
            </label>
          </div>
        </AdminForm>
      </section>

      <section aria-label="Existing technologies" className={ui.sectionBlock}>
        <h2 className={ui.sectionTitle}>Existing technologies ({technologies.length})</h2>
        {technologies.length === 0 ? (
          <p className={ui.hint}>No technologies yet.</p>
        ) : (
          technologies.map((technology) => (
            <div key={technology.id} className={ui.form}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>{technology.name}</strong>
                <ConfirmAction
                  action={deleteTechnologyAction.bind(null, technology.id)}
                  label="Delete"
                  confirmMessage={`Delete “${technology.name}”? It is removed from every project using it.`}
                />
              </div>
              <AdminForm
                action={updateTechnologyAction.bind(null, technology.id)}
                submitLabel="Update"
              >
                <div className={ui.gridTwo}>
                  <label className={ui.field}>
                    <span className={ui.label}>Name</span>
                    <input
                      name="name"
                      type="text"
                      required
                      defaultValue={technology.name}
                      className={ui.input}
                    />
                  </label>
                  <label className={ui.field}>
                    <span className={ui.label}>Category</span>
                    <select name="category" defaultValue={technology.category} className={ui.select}>
                      {TECH_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={ui.gridTwo}>
                  <label className={ui.field}>
                    <span className={ui.label}>Icon</span>
                    <select name="icon" defaultValue={technology.icon} className={ui.select}>
                      <option value="">None</option>
                      {TECH_ICON_KEYS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={ui.field}>
                    <span className={ui.label}>Proficiency</span>
                    <input
                      name="proficiency"
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={technology.proficiency ?? ''}
                      className={ui.input}
                    />
                  </label>
                </div>
                <label className={ui.field}>
                  <span className={ui.label}>Short description</span>
                  <input
                    name="description"
                    type="text"
                    defaultValue={technology.description}
                    className={ui.input}
                  />
                </label>
                <div className={ui.gridTwo}>
                  <label className={ui.field}>
                    <span className={ui.label}>Display order</span>
                    <input
                      name="display_order"
                      type="number"
                      min={0}
                      defaultValue={technology.display_order}
                      className={ui.input}
                    />
                  </label>
                  <label className={ui.checkItem}>
                    <input
                      type="checkbox"
                      name="is_visible"
                      defaultChecked={technology.is_visible}
                    />
                    <span>Visible on public site</span>
                  </label>
                </div>
              </AdminForm>
            </div>
          ))
        )}
      </section>
    </>
  )
}

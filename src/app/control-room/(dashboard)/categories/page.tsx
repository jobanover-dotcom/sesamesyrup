import { requireAdminClient } from '@/features/admin/auth'
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from '@/features/admin/actions/taxonomy'
import { listAdminCategories } from '@/features/admin/repository'
import { AdminForm } from '@/features/admin/components/AdminForm'
import { ConfirmAction } from '@/features/admin/components/ConfirmAction'
import ui from '@/features/admin/ui.module.css'

export default async function CategoriesPage() {
  const client = await requireAdminClient()
  const categories = await listAdminCategories(client)

  return (
    <>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Project Categories</h1>
        <span className={ui.pageSubtitle}>Reusable across projects</span>
      </div>

      <section aria-label="Create category" style={{ marginBottom: '2rem' }}>
        <h2 className={ui.sectionTitle}>Create category</h2>
        <AdminForm action={createCategoryAction} submitLabel="Create category">
          <label className={ui.field}>
            <span className={ui.label}>Name</span>
            <input name="name" type="text" required maxLength={120} className={ui.input} />
          </label>
          <label className={ui.field}>
            <span className={ui.label}>Slug</span>
            <input
              name="slug"
              type="text"
              required
              maxLength={120}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              className={`${ui.input} ${ui.mono}`}
            />
          </label>
          <label className={ui.field}>
            <span className={ui.label}>Description</span>
            <input name="description" type="text" maxLength={280} className={ui.input} />
          </label>
          <label className={ui.field}>
            <span className={ui.label}>Display order</span>
            <input
              name="display_order"
              type="number"
              min={0}
              defaultValue={categories.length + 1}
              className={ui.input}
            />
          </label>
        </AdminForm>
      </section>

      <section aria-label="Existing categories" className={ui.sectionBlock}>
        <h2 className={ui.sectionTitle}>Existing categories ({categories.length})</h2>
        {categories.length === 0 ? (
          <p className={ui.hint}>No categories yet.</p>
        ) : (
          categories.map((category) => (
            <div key={category.id} className={ui.form}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>{category.name}</strong>
                <ConfirmAction
                  action={deleteCategoryAction.bind(null, category.id)}
                  label="Delete"
                  confirmMessage={`Delete category “${category.name}”? Projects using it become uncategorized.`}
                />
              </div>
              <AdminForm
                action={updateCategoryAction.bind(null, category.id)}
                submitLabel="Update"
              >
                <div className={ui.gridTwo}>
                  <label className={ui.field}>
                    <span className={ui.label}>Name</span>
                    <input
                      name="name"
                      type="text"
                      required
                      defaultValue={category.name}
                      className={ui.input}
                    />
                  </label>
                  <label className={ui.field}>
                    <span className={ui.label}>Slug</span>
                    <input
                      name="slug"
                      type="text"
                      required
                      pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                      defaultValue={category.slug}
                      className={`${ui.input} ${ui.mono}`}
                    />
                  </label>
                </div>
                <label className={ui.field}>
                  <span className={ui.label}>Description</span>
                  <input
                    name="description"
                    type="text"
                    defaultValue={category.description}
                    className={ui.input}
                  />
                </label>
                <label className={ui.field}>
                  <span className={ui.label}>Display order</span>
                  <input
                    name="display_order"
                    type="number"
                    min={0}
                    defaultValue={category.display_order}
                    className={ui.input}
                  />
                </label>
              </AdminForm>
            </div>
          ))
        )}
      </section>
    </>
  )
}

import { requireAdminClient } from '@/features/admin/auth'
import {
  createSocialLinkAction,
  deleteSocialLinkAction,
  updateSocialLinkAction,
} from '@/features/admin/actions/content'
import { listAdminSocialLinks } from '@/features/admin/repository'
import { AdminForm } from '@/features/admin/components/AdminForm'
import { ConfirmAction } from '@/features/admin/components/ConfirmAction'
import ui from '@/features/admin/ui.module.css'
import page from './social-page.module.css'

export default async function SocialPage() {
  const client = await requireAdminClient()
  const links = await listAdminSocialLinks(client)

  return (
    <>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Social Links</h1>
        <span className={ui.pageSubtitle}>Shown in hero and footer</span>
      </div>

      <section aria-label="Create social link" style={{ marginBottom: '2rem' }}>
        <h2 className={ui.sectionTitle}>Create link</h2>
        <AdminForm action={createSocialLinkAction} submitLabel="Create link">
          <div className={ui.gridTwo}>
            <label className={ui.field}>
              <span className={ui.label}>Platform</span>
              <input
                name="platform"
                type="text"
                required
                maxLength={80}
                placeholder="GitHub, LinkedIn…"
                className={ui.input}
              />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>URL</span>
              <input
                name="url"
                type="url"
                required
                placeholder="https://"
                className={ui.input}
              />
            </label>
          </div>
          <div className={ui.gridTwo}>
            <label className={ui.field}>
              <span className={ui.label}>Display order</span>
              <input
                name="display_order"
                type="number"
                min={0}
                defaultValue={links.length + 1}
                className={ui.input}
              />
            </label>
            <label className={page.visibleRow}>
              <input type="checkbox" name="is_visible" defaultChecked />
              <span>Visible on public site</span>
            </label>
          </div>
        </AdminForm>
      </section>

      <section aria-label="Existing links" className={ui.sectionBlock}>
        <h2 className={ui.sectionTitle}>Existing links ({links.length})</h2>
        {links.length === 0 ? (
          <p className={ui.hint}>No links yet.</p>
        ) : (
          links.map((link) => (
            <div key={link.id} className={ui.form}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>{link.platform}</strong>
                <ConfirmAction
                  action={deleteSocialLinkAction.bind(null, link.id)}
                  label="Delete"
                  confirmMessage={`Delete the ${link.platform} link?`}
                />
              </div>
              <AdminForm
                action={updateSocialLinkAction.bind(null, link.id)}
                submitLabel="Update"
              >
                <div className={ui.gridTwo}>
                  <label className={ui.field}>
                    <span className={ui.label}>Platform</span>
                    <input
                      name="platform"
                      type="text"
                      required
                      defaultValue={link.platform}
                      className={ui.input}
                    />
                  </label>
                  <label className={ui.field}>
                    <span className={ui.label}>URL</span>
                    <input
                      name="url"
                      type="url"
                      required
                      defaultValue={link.url}
                      className={ui.input}
                    />
                  </label>
                </div>
                <div className={ui.gridTwo}>
                  <label className={ui.field}>
                    <span className={ui.label}>Display order</span>
                    <input
                      name="display_order"
                      type="number"
                      min={0}
                      defaultValue={link.display_order}
                      className={ui.input}
                    />
                  </label>
                  <label className={page.visibleRow}>
                    <input
                      type="checkbox"
                      name="is_visible"
                      defaultChecked={link.is_visible}
                    />
                    <span>Visible</span>
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

import { requireAdminClient } from '@/features/admin/auth'
import { listAdminSettings } from '@/features/admin/repository'
import { updateSettingsAction } from '@/features/admin/actions/content'
import { AdminForm } from '@/features/admin/components/AdminForm'
import ui from '@/features/admin/ui.module.css'

export default async function SettingsPage() {
  const client = await requireAdminClient()
  const settings = await listAdminSettings(client)
  const values = new Map(settings.map((row) => [row.setting_key, row.setting_value]))

  return (
    <>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Settings</h1>
        <span className={ui.pageSubtitle}>Public defaults and configuration reference</span>
      </div>

      <AdminForm action={updateSettingsAction} submitLabel="Save settings">
        <label className={ui.field}>
          <span className={ui.label}>Portfolio title (browser tab, SEO default)</span>
          <input
            name="portfolio_title"
            type="text"
            maxLength={160}
            defaultValue={values.get('portfolio_title') ?? 'Job Añover — Portfolio'}
            className={ui.input}
          />
        </label>
        <label className={ui.field}>
          <span className={ui.label}>SEO description</span>
          <textarea
            name="seo_description"
            rows={3}
            maxLength={300}
            defaultValue={values.get('seo_description') ?? ''}
            className={ui.textarea}
          />
        </label>
        <label className={ui.field}>
          <span className={ui.label}>Default theme for new visitors</span>
          <select
            name="default_theme"
            defaultValue={values.get('default_theme') || 'dark'}
            className={ui.select}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>
        <p className={ui.hint}>
          The contact form integration is configured via the FORMSPREE_ENDPOINT
          environment variable on the server. It is intentionally not editable here,
          because form delivery depends on it at deploy time.
        </p>
      </AdminForm>
    </>
  )
}

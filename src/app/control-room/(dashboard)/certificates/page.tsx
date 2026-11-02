import { requireAdminClient } from '@/features/admin/auth'
import {
  createCertificateAction,
  deleteCertificateAction,
  updateCertificateAction,
} from '@/features/admin/actions/content'
import { listAdminCertificates } from '@/features/admin/repository'
import { AdminForm } from '@/features/admin/components/AdminForm'
import { ConfirmAction } from '@/features/admin/components/ConfirmAction'
import { FileUploadField } from '@/features/admin/components/FileUploadField'
import ui from '@/features/admin/ui.module.css'
import page from './certificates-page.module.css'

export default async function CertificatesPage() {
  const client = await requireAdminClient()
  const certificates = await listAdminCertificates(client)

  return (
    <>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Certificates</h1>
        <span className={ui.pageSubtitle}>Editorial gallery content</span>
      </div>

      <section aria-label="Create certificate" style={{ marginBottom: '2rem' }}>
        <h2 className={ui.sectionTitle}>Create certificate</h2>
        <AdminForm action={createCertificateAction} submitLabel="Create certificate">
          <div className={ui.gridTwo}>
            <label className={ui.field}>
              <span className={ui.label}>Title</span>
              <input name="title" type="text" required maxLength={240} className={ui.input} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Issuing organization</span>
              <input name="issuer" type="text" maxLength={200} className={ui.input} />
            </label>
          </div>
          <div className={ui.gridTwo}>
            <label className={ui.field}>
              <span className={ui.label}>Issue date</span>
              <input name="issue_date" type="date" className={ui.input} />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Credential ID (optional)</span>
              <input name="credential_id" type="text" maxLength={160} className={ui.input} />
            </label>
          </div>
          <FileUploadField name="file_url" kind="certificates" label="Certificate image or PDF" />

          <div className={ui.gridTwo}>
            <label className={ui.field}>
              <span className={ui.label}>Verification URL (optional)</span>
              <input
                name="verification_url"
                type="url"
                placeholder="https://"
                className={ui.input}
              />
            </label>
            <label className={ui.field}>
              <span className={ui.label}>Display order</span>
              <input
                name="display_order"
                type="number"
                min={0}
                defaultValue={certificates.length + 1}
                className={ui.input}
              />
            </label>
          </div>
          <label className={page.publishedRow}>
            <input type="checkbox" name="is_published" defaultChecked />
            <span>Published (visible publicly)</span>
          </label>
          <div className={ui.field}>
            <span className={ui.label}>Description (optional)</span>
            <input name="description" type="text" maxLength={280} className={ui.input} />
          </div>
        </AdminForm>
      </section>

      <section aria-label="Existing certificates" className={ui.sectionBlock}>
        <h2 className={ui.sectionTitle}>Existing certificates ({certificates.length})</h2>
        {certificates.length === 0 ? (
          <p className={ui.hint}>No certificates yet.</p>
        ) : (
          certificates.map((certificate) => (
            <div key={certificate.id} className={ui.form}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>{certificate.title}</strong>
                <ConfirmAction
                  action={deleteCertificateAction.bind(null, certificate.id)}
                  label="Delete"
                  confirmMessage={`Delete certificate “${certificate.title}”?`}
                />
              </div>
              {!certificate.file_url ? (
                <p className={page.missingFile}>No image or PDF uploaded yet.</p>
              ) : null}
              <AdminForm
                action={updateCertificateAction.bind(null, certificate.id)}
                submitLabel="Update"
              >
                <div className={ui.gridTwo}>
                  <label className={ui.field}>
                    <span className={ui.label}>Title</span>
                    <input
                      name="title"
                      type="text"
                      required
                      defaultValue={certificate.title}
                      className={ui.input}
                    />
                  </label>
                  <label className={ui.field}>
                    <span className={ui.label}>Issuing organization</span>
                    <input
                      name="issuer"
                      type="text"
                      defaultValue={certificate.issuer}
                      className={ui.input}
                    />
                  </label>
                </div>
                <div className={ui.gridTwo}>
                  <label className={ui.field}>
                    <span className={ui.label}>Issue date</span>
                    <input
                      name="issue_date"
                      type="date"
                      defaultValue={certificate.issue_date ?? ''}
                      className={ui.input}
                    />
                  </label>
                  <label className={ui.field}>
                    <span className={ui.label}>Credential ID</span>
                    <input
                      name="credential_id"
                      type="text"
                      defaultValue={certificate.credential_id ?? ''}
                      className={ui.input}
                    />
                  </label>
                </div>
                <FileUploadField
                  name="file_url"
                  kind="certificates"
                  label="Replace certificate image or PDF"
                  initialValue={certificate.file_url}
                />
                <div className={ui.gridTwo}>
                  <label className={ui.field}>
                    <span className={ui.label}>Verification URL</span>
                    <input
                      name="verification_url"
                      type="url"
                      defaultValue={certificate.verification_url ?? ''}
                      className={ui.input}
                    />
                  </label>
                  <label className={ui.field}>
                    <span className={ui.label}>Display order</span>
                    <input
                      name="display_order"
                      type="number"
                      min={0}
                      defaultValue={certificate.display_order}
                      className={ui.input}
                    />
                  </label>
                </div>
                <label className={ui.field}>
                  <span className={ui.label}>Description</span>
                  <input
                    name="description"
                    type="text"
                    defaultValue={certificate.description}
                    className={ui.input}
                  />
                </label>
                <label className={page.publishedRow}>
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={certificate.is_published}
                  />
                  <span>Published</span>
                </label>
              </AdminForm>
            </div>
          ))
        )}
      </section>
    </>
  )
}

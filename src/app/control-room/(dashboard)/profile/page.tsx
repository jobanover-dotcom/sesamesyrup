import { requireAdminClient } from '@/features/admin/auth'
import { getAdminProfile } from '@/features/admin/repository'
import { updateProfileAction } from '@/features/admin/actions/content'
import { AdminForm } from '@/features/admin/components/AdminForm'
import { FileUploadField } from '@/features/admin/components/FileUploadField'
import ui from '@/features/admin/ui.module.css'
import page from './profile-page.module.css'

export default async function ProfilePage() {
  const client = await requireAdminClient()
  const profile = await getAdminProfile(client)

  if (!profile) {
    return (
      <>
        <h1 className={ui.pageTitle}>Profile Information</h1>
        <p className={ui.errorNote} role="alert">
          The profile row is missing. Re-run the database migration seed to create it.
        </p>
      </>
    )
  }

  return (
    <>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Profile Information</h1>
        <span className={ui.pageSubtitle}>Hero and identity content</span>
      </div>

      <AdminForm action={updateProfileAction} submitLabel="Save profile">
        <div className={ui.gridTwo}>
          <label className={ui.field}>
            <span className={ui.label}>Full name</span>
            <input
              name="full_name"
              type="text"
              required
              defaultValue={profile.full_name}
              className={ui.input}
            />
          </label>
          <label className={ui.field}>
            <span className={ui.label}>Professional title</span>
            <input
              name="professional_title"
              type="text"
              defaultValue={profile.professional_title}
              className={ui.input}
            />
          </label>
        </div>

        <label className={ui.field}>
          <span className={page.wordCounted}>Introduction / bio</span>
          <textarea
            name="bio"
            rows={6}
            defaultValue={profile.bio}
            className={ui.textarea}
          />
        </label>

        <div className={ui.gridTwo}>
          <FileUploadField
            name="profile_image"
            kind="profile"
            label="Profile photo (grayscale portrait)"
            initialValue={profile.profile_image}
          />
          <label className={ui.field}>
            <span className={ui.label}>Location (optional)</span>
            <input
              name="location"
              type="text"
              defaultValue={profile.location ?? ''}
              className={ui.input}
            />
          </label>
        </div>

        <FileUploadField
          name="cv_url"
          kind="cv"
          label="CV document (PDF, downloadable by visitors)"
          initialValue={profile.cv_url}
        />
      </AdminForm>
    </>
  )
}

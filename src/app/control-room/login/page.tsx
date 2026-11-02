import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { signIn } from '@/features/admin/actions/session'
import { describeAuthError } from '@/features/admin/actions/messages'
import { getCurrentAdminState } from '@/features/admin/auth'
import styles from './login.module.css'

export const metadata: Metadata = {
  title: 'Sign in — Control Room',
  robots: { index: false, follow: false },
}

export default async function ControlRoomLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  // Already-authorized accounts skip the form.
  const adminClient = await getCurrentAdminState()
  if (adminClient) redirect('/control-room')

  const { error } = await searchParams
  const message = error ? describeAuthError(error) : null

  return (
    <main id="main" className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>
          Private access — unauthorized use is prohibited.
        </p>
        <h1 className={styles.title}>Control Room</h1>
        {message ? (
          <p role="alert" className={styles.error}>
            {message}
          </p>
        ) : null}
        <form action={signIn} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.submit}>
            Sign in
          </button>
        </form>
      </div>
    </main>
  )
}

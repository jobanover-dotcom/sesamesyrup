import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <main id="main" className={styles.page}>
      <div className={styles.content}>
        <p className={styles.index}>Error — 404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.lede}>
          The page you were looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className={styles.cta}>
          Back to the portfolio
        </Link>
      </div>
    </main>
  )
}

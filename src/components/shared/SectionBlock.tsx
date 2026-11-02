import type { ReactNode } from 'react'
import styles from './SectionBlock.module.css'

/** Standard page-frame section wrapper with generous editorial spacing. */
export function SectionBlock({
  id,
  children,
}: {
  id?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={styles.section} data-section={id}>
      {children}
    </section>
  )
}

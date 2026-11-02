import type { ReactNode } from 'react'
import styles from './SectionHeading.module.css'

/**
 * Numbered editorial section header: mono index, hairline rule, oversized
 * serif title. "indexLabel" is e.g. "01" and "title" e.g. "PROJECTS".
 */
export function SectionHeading({
  indexLabel,
  title,
  children,
  id,
}: {
  indexLabel: string
  title: string
  children?: ReactNode
  id?: string
}) {
  return (
    <header id={id} className={styles.heading}>
      <div className={styles.rule} aria-hidden="true" />
      <div className={styles.row}>
        <span className={styles.index}>{indexLabel}</span>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {children ? <div className={styles.lede}>{children}</div> : null}
    </header>
  )
}

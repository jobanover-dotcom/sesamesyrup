'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'
import type { Project } from '@/features/portfolio/types'
import styles from './ProjectCard.module.css'

/**
 * Editorial project card: grayscale at rest, full color in direct
 * interaction. The whole visual is a button that opens the quick view; the
 * title links to the dedicated /projects/[slug] page.
 */
export function ProjectCard({
  project,
  wide,
  onOpen,
}: {
  project: Project
  wide?: boolean
  onOpen: (project: Project) => void
}) {
  const dateLabel = project.project_date?.slice(0, 7) ?? '';

  return (
    <article className={styles.card} data-spotlight={true} data-wide={wide || undefined}>
      <button
        type="button"
        className={styles.mediaButton}
        onClick={() => onOpen(project)}
        aria-label={`Quick view: ${project.title}`}
        aria-haspopup="dialog"
      >
        <span className={styles.mediaFrame}>
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={project.title}
              width={880}
              height={620}
              className={styles.mediaImage}
              sizes="(max-width: 900px) 88vw, 560px"
              loading="lazy"
            />
          ) : (
            <span className={`${styles.mediaImage} ${styles.mediaPlaceholder}`}>
              {project.title.slice(0, 2)}
            </span>
          )}
          <span className={styles.spot} aria-hidden="true" />
          <span className={styles.playCue} aria-hidden="true">
            <Play size={13} />
            Quick view
          </span>
        </span>
      </button>

      <div className={styles.metaRow}>
        {project.category ? (
          <span className={styles.category}>{project.category.name}</span>
        ) : null}
        <span className={styles.date}>{dateLabel}</span>
      </div>

      <h3 className={styles.title}>
        <Link href={`/projects/${project.slug}`} className={styles.titleLink}>
          {project.title}
          <ArrowUpRight size={16} aria-hidden={true} className={styles.titleArrow} />
        </Link>
      </h3>

      <p className={styles.summary}>{project.short_description}</p>

      {project.technologies.length > 0 ? (
        <ul className={styles.tags} aria-label="Technologies used">
          {project.technologies.slice(0, 5).map((technology) => (
            <li key={technology.id} className={styles.tag}>
              {technology.name}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

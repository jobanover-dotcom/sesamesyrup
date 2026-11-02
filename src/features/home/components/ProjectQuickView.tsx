'use client'

import { forwardRef, useEffect, useRef, type ComponentRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, X } from 'lucide-react'
import type { Project } from '@/features/portfolio/types'
import { formatMonthYear, safeHttpUrl } from '@/lib/utils'
import styles from './ProjectQuickView.module.css'

type DialogElement = ComponentRef<'dialog'>

/**
 * Glass quick-view overlay for projects, built on the native <dialog>
 * element for free focus trapping, Esc handling and inert background.
 */
export const ProjectQuickView = forwardRef<
  DialogElement,
  { project: Project | null; onClose: () => void }
>(function ProjectQuickView({ project, onClose }, forwardedRef) {
  const localDialogRef = useRef<DialogElement>(null)
  const setDialog = (element: DialogElement | null) => {
    localDialogRef.current = element
    if (typeof forwardedRef === 'function') forwardedRef(element)
    else if (forwardedRef) forwardedRef.current = element
  }
  const dialogRef = localDialogRef as React.RefObject<DialogElement | null>

  const scrollTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (project && !dialog.open) {
      dialog.showModal()
      scrollTargetRef.current?.scrollTo({ top: 0 })
    }
    if (!project && dialog.open) dialog.close()
  }, [project, dialogRef])

  const links = project
    ? [
        { label: 'Live demo', url: project.live_url },
        { label: 'GitHub', url: project.github_url },
        { label: 'Figma', url: project.figma_url },
        { label: 'External', url: project.other_url },
      ].filter((link): link is { label: string; url: string } =>
        Boolean(link.url && safeHttpUrl(link.url)),
      )
    : []

  return (
    <dialog
      ref={setDialog}
      className={styles.modal}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby="quick-view-title"
    >
      <div ref={scrollTargetRef} className={styles.inner}>
        {project ? (
          <article>
            <div className={styles.mediaRow}>
              {project.images.length > 0 ? (
                project.images.map((image) => (
                  <Image
                    key={image.id}
                    src={image.image_url}
                    alt={image.alt_text || project.title}
                    width={720}
                    height={480}
                    className={styles.image}
                    sizes="(max-width: 760px) 92vw, 640px"
                    loading="lazy"
                  />
                ))
              ) : project.cover_image ? (
                <Image
                  src={project.cover_image}
                  alt={project.title}
                  width={720}
                  height={480}
                  className={styles.image}
                  sizes="(max-width: 760px) 92vw, 640px"
                  loading="lazy"
                />
              ) : null}
            </div>

            <div className={styles.body}>
              <div className={styles.headRow}>
                <div>
                  <p className={styles.meta}>
                    {[project.category?.name, formatMonthYear(project.project_date)]
                      .filter(Boolean)
                      .join('  ·  ')}
                  </p>
                  <h2 id="quick-view-title" className={styles.title}>
                    {project.title}
                  </h2>
                </div>
                <button
                  type="button"
                  className={styles.close}
                  onClick={onClose}
                  aria-label="Close quick view"
                >
                  <X size={16} aria-hidden={true} />
                </button>
              </div>

              <p className={styles.description}>
                {project.description || project.short_description}
              </p>

              {project.technologies.length > 0 ? (
                <ul className={styles.tags} aria-label="Technologies used">
                  {project.technologies.map((technology) => (
                    <li key={technology.id} className={styles.tag}>
                      {technology.name}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className={styles.footRow}>
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.linkChip}
                  >
                    <ExternalLink size={13} aria-hidden={true} />
                    {link.label}
                  </a>
                ))}
                <Link
                  href={`/projects/${project.slug}`}
                  className={styles.linkChipSolid}
                  onClick={onClose}
                >
                  Open project page <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </dialog>
  )
})

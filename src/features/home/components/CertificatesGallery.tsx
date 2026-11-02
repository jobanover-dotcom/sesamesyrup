'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type ComponentRef } from 'react'
import { ExternalLink, FileText, X } from 'lucide-react'
import type { Certificate } from '@/features/portfolio/types'
import { formatMonthYear } from '@/lib/utils'
import styles from './CertificatesGallery.module.css'

type DialogElement = ComponentRef<'dialog'>

/**
 * Editorial certificate list with a glass lightbox for image previews,
 * PDF links and credential verification links.
 */
export function CertificatesGallery({ certificates }: { certificates: Certificate[] }) {
  const [active, setActive] = useState<Certificate | null>(null)
  const dialogRef = useRef<DialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (active && !dialog.open) dialog.showModal()
    if (!active && dialog.open) dialog.close()
  }, [active])

  const isPdf = (url: string) => {
    try {
      return new URL(url).pathname.toLowerCase().endsWith('.pdf')
    } catch {
      return url.toLowerCase().endsWith('.pdf')
    }
  }

  return (
    <>
      <ol className={styles.list}>
        {certificates.map((certificate, index) => {
          const fileIsImage =
            Boolean(certificate.file_url) &&
            !isPdf(certificate.file_url as string)
          const canPreview = Boolean(certificate.file_url) && fileIsImage

          return (
            <li key={certificate.id} className={styles.row}>
              <span className={styles.index}>
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className={styles.main}>
                <h3 className={styles.title}>{certificate.title}</h3>
                <p className={styles.meta}>
                  {[
                    certificate.issuer,
                    formatMonthYear(certificate.issue_date),
                    certificate.credential_id ? `ID ${certificate.credential_id}` : '',
                  ]
                    .filter(Boolean)
                    .join('  ·  ')}
                </p>
                {certificate.description ? (
                  <p className={styles.description}>{certificate.description}</p>
                ) : null}
              </div>

              <div className={styles.actions}>
                {canPreview ? (
                  <button
                    type="button"
                    className={styles.action}
                    onClick={() => setActive(certificate)}
                    aria-haspopup="dialog"
                  >
                    View
                  </button>
                ) : null}
                {certificate.file_url ? (
                  <a
                    href={certificate.file_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.action}
                  >
                    <FileText size={13} aria-hidden={true} />
                    {fileIsImage ? 'Open image' : 'Open PDF'}
                  </a>
                ) : null}
                {certificate.verification_url ? (
                  <a
                    href={certificate.verification_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.action}
                  >
                    <ExternalLink size={13} aria-hidden={true} />
                    Verify
                  </a>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActive(null)
        }}
        aria-labelledby="certificate-lightbox-title"
      >
        {active ? (
          <figure>
            <div className={styles.lightboxHead}>
              <h2 id="certificate-lightbox-title" className={styles.lightboxTitle}>
                {active.title}
              </h2>
              <button
                type="button"
                className={styles.lightboxClose}
                onClick={() => setActive(null)}
                aria-label="Close preview"
              >
                <X size={16} aria-hidden={true} />
              </button>
            </div>
            {active.file_url ? (
              <Image
                src={active.file_url}
                alt={`Certificate: ${active.title}`}
                width={960}
                height={720}
                className={styles.lightboxImage}
                sizes="(max-width: 860px) 92vw, 780px"
                loading="lazy"
              />
            ) : null}
            <figcaption className={styles.lightboxMeta}>
              {[
                active.issuer,
                formatMonthYear(active.issue_date),
                active.credential_id ? `ID ${active.credential_id}` : '',
              ]
                .filter(Boolean)
                .join('  ·  ')}
            </figcaption>
          </figure>
        ) : null}
      </dialog>
    </>
  )
}

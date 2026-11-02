import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { Masthead } from '@/components/shared/Masthead'
import { Footer } from '@/features/home/components/Footer'
import { getProjectBySlug, getProfile, getSettings, getSocialLinks } from '@/features/portfolio/repository'
import { formatMonthYear, safeHttpUrl } from '@/lib/utils'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSettings()])
  if (!project) return { title: 'Project not found' }
  return {
    title: project.title,
    description: project.short_description || settings.description,
    alternates: { canonical: `./projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.short_description || settings.description,
      type: 'article',
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [project, profile, socialLinks] = await Promise.all([
    getProjectBySlug(slug),
    getProfile(),
    getSocialLinks(),
  ])
  if (!project) notFound()

  const sections = project.description.split(/\n{2,}/)
  const links = [
    { label: 'Live demo', url: project.live_url },
    { label: 'GitHub repository', url: project.github_url },
    { label: 'Figma file', url: project.figma_url },
    { label: 'External link', url: project.other_url },
  ].filter((link): link is { label: string; url: string } =>
    Boolean(link.url && safeHttpUrl(link.url)),
  )

  const gallery = project.images.length > 0
    ? project.images
    : project.cover_image
      ? [{ id: 0, project_id: project.id, image_url: project.cover_image, alt_text: project.title, display_order: 0 }]
      : []

  return (
    <>
      <Masthead brand={profile?.full_name || 'Portfolio'} />
      <main id="main">
        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.metaRow}>
              <Link href="/#projects" className={styles.backlink}>
                ← All projects
              </Link>
              <p className={styles.meta}>
                {[project.category?.name, formatMonthYear(project.project_date)]
                  .filter(Boolean)
                  .join('  ·  ')}
              </p>
            </div>
            <h1 className={styles.heading}>{project.title}</h1>
            <p className={styles.standfirst}>{project.short_description}</p>
          </header>

          {project.cover_image ? (
            <div className={styles.cover}>
              <Image
                src={project.cover_image}
                alt={project.title}
                width={1280}
                height={880}
                className={styles.coverImage}
                sizes="(max-width: 900px) 96vw, 1200px"
                priority={true}
              />
            </div>
          ) : null}

          <div className={styles.columns}>
            <div className={styles.body}>
              {sections.map((section, index) => (
                <p key={index} className={styles.paragraph}>
                  {section}
                </p>
              ))}
              {!project.description && !project.short_description ? (
                <p className={styles.paragraph}>Project description coming soon.</p>
              ) : null}
            </div>

            <aside className={styles.sidebar} aria-label="Project facts">
              {project.technologies.length > 0 ? (
                <div className={styles.factsGroup}>
                  <p className={styles.factsLabel}>Technologies</p>
                  <ul className={styles.tags}>
                    {project.technologies.map((technology) => (
                      <li key={technology.id} className={styles.tag}>
                        {technology.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {links.length > 0 ? (
                <div className={styles.factsGroup}>
                  <p className={styles.factsLabel}>Links</p>
                  <ul className={styles.linkList}>
                    {links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={styles.link}
                        >
                          <ExternalLink size={12} aria-hidden={true} />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {project.is_featured ? (
                <div className={styles.factsGroup}>
                  <p className={styles.factsLabel}>Featured project</p>
                </div>
              ) : null}
            </aside>
          </div>

          {gallery.length > 0 ? (
            <div className={styles.gallery}>
              {gallery.map((image) => (
                <Image
                  key={image.id}
                  src={image.image_url}
                  alt={image.alt_text || project.title}
                  width={1100}
                  height={760}
                  className={styles.galleryImage}
                  sizes="(max-width: 900px) 96vw, 1100px"
                  loading="lazy"
                />
              ))}
            </div>
          ) : null}
        </article>
      </main>
      <Footer name={profile?.full_name || 'Portfolio'} socialLinks={socialLinks} />
    </>
  )
}

export const runtime = 'nodejs'

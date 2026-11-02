import {
  CertificatesGallery,
} from '@/features/home/components/CertificatesGallery'
import { ContactForm } from '@/features/home/components/ContactForm'
import { Footer } from '@/features/home/components/Footer'
import { Hero } from '@/features/home/components/Hero'
import { LightField } from '@/features/home/components/LightField'
import { TechnologyMarquee } from '@/features/home/components/Marquee'
import { ProjectsExplorer } from '@/features/home/components/ProjectsExplorer'
import { TechnologiesGrid } from '@/features/home/components/TechnologiesGrid'
import { RevealObserver } from '@/components/shared/RevealObserver'
import { SectionBlock } from '@/components/shared/SectionBlock'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Masthead } from '@/components/shared/Masthead'
import {
  getCategories,
  getCertificates,
  getProfile,
  getPublishedProjects,
  getSettings,
  getSocialLinks,
  getTechnologies,
} from '@/features/portfolio/repository'
import styles from './page.module.css'

export async function generateMetadata() {
  const settings = await getSettings()
  return {
    title: settings.title,
    description: settings.description,
    alternates: { canonical: './' },
  }
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [profile, categories, projects, technologies, certificates, socialLinks] =
    await Promise.all([
      getProfile(),
      getCategories(),
      getPublishedProjects(),
      getTechnologies(),
      getCertificates(),
      getSocialLinks(),
    ])

  const name = profile?.full_name || 'Job Añover'
  const marqueeTechnologies = technologies.filter((technology) => technology.is_visible)
  const hasGallery = projects.length > 0

  return (
    <>
      <Masthead brand={name} />
      <RevealObserver />

      <main id="main">
        {/* HERO + light-field */}
        <section id="about" className={styles.heroWrap}>
          <LightField />
          <Hero
            profile={profile}
            socialLinks={socialLinks}
            today={String(new Date().getFullYear())}
          />
        </section>

        {/* MARQUEE */}
        <SectionBlock id="marquee">
          <TechnologyMarquee technologies={marqueeTechnologies} />
        </SectionBlock>

        {/* 01 — PROJECTS */}
        <SectionBlock id="projects">
          <SectionHeading indexLabel="01" title="Projects">
            Selected work across design, web applications and multimedia — open any
            card for details, or visit a project&apos;s own page.
          </SectionHeading>

          {hasGallery ? (
            <div className="reveal">
              <ProjectsExplorer projects={projects} categories={categories} />
            </div>
          ) : (
            <p className={styles.emptyNote}>
              The project archive is being prepared. Check back soon.
            </p>
          )}
        </SectionBlock>

        {/* 02 — TECHNOLOGIES */}
        <SectionBlock id="technologies">
          <SectionHeading indexLabel="02" title="Technologies">
            Tools and stacks I work with day to day.
          </SectionHeading>

          {technologies.length > 0 ? (
            <div className="reveal">
              <TechnologiesGrid technologies={technologies} />
            </div>
          ) : (
            <p className={styles.emptyNote}>Technology index is being prepared.</p>
          )}
        </SectionBlock>

        {/* 03 — CERTIFICATES */}
        <SectionBlock id="certificates">
          <SectionHeading indexLabel="03" title="Certificates">
            Verified credentials and completed coursework.
          </SectionHeading>

          {certificates.length > 0 ? (
            <div className="reveal">
              <CertificatesGallery certificates={certificates} />
            </div>
          ) : (
            <p className={styles.emptyNote}>The certificate gallery is being prepared.</p>
          )}
        </SectionBlock>

        {/* 04 — CONTACT */}
        <SectionBlock id="contact">
          <SectionHeading indexLabel="04" title="Contact" />

          <div className={styles.contactLayout}>
            <h2 className={`${styles.invitation} reveal`}>
              Let&apos;s work <em>together.</em>
            </h2>
            <p className={`${styles.contactNote} reveal reveal-delay-1`}>
              Have a project, role or collaboration in mind? Describe it briefly —
              messages are delivered directly to my inbox.
            </p>
            {process.env.FORMSPREE_ENDPOINT ? (
              <div className={`${styles.contactCard} reveal reveal-delay-2`}>
                <ContactForm endpoint={process.env.FORMSPREE_ENDPOINT} />
              </div>
            ) : (
              <div className={`${styles.contactFallback} reveal reveal-delay-2`}>
                <p className={styles.contactEmailHint}>
                  The contact form is not configured yet. Reach me through any
                  social link above.
                </p>
              </div>
            )}
          </div>
        </SectionBlock>
      </main>

      <Footer name={name} socialLinks={socialLinks} />
    </>
  )
}

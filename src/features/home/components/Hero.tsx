import Image from 'next/image'
import Link from 'next/link'
import {
  Download,
  FileText,
  GitBranch,
  Briefcase,
  MapPin,
  SquareArrowOutUpRight,
} from 'lucide-react'
import type { Profile, SocialLink } from '@/features/portfolio/types'
import { formatMonthYear } from '@/lib/utils'
import styles from './Hero.module.css'

/**
 * Asymmetric editorial hero: oversized serif masthead line, arched grayscale
 * portrait with offset hairline frame, floating glass information card.
 * Light-field animation renders behind (separate component).
 */
export function Hero({
  profile,
  socialLinks,
  today,
}: {
  profile: Profile | null
  socialLinks: SocialLink[]
  today: string
}) {
  const name = profile?.full_name || 'Job Añover'
  const [first, ...rest] = name.split(' ')
  const portraitUrl = profile?.profile_image ?? null
  const cvUrl = profile?.cv_url ?? null

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.textColumn}>
          <p className={styles.kicker}>Portfolio — Est. {today}</p>

          <h1 className={styles.title}>
            <span className={styles.titleLine}>{first}</span>{' '}
            <em className={styles.titleAccent}>{rest.join(' ')}</em>
          </h1>

          {profile?.professional_title ? (
            <p className={styles.role}>{profile.professional_title}</p>
          ) : null}

          <p className={styles.bio}>{profile?.bio}</p>

          <div className={styles.actions} role="group" aria-label="Profile actions">
            {cvUrl ? (
              <a
                href={cvUrl}
                download="job-anover-cv.pdf"
                className={styles.primaryAction}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={14} aria-hidden={true} />
                Download CV
              </a>
            ) : null}
            <a
              href="#projects"
              className={styles.secondaryAction}
            >
              View projects
            </a>
          </div>
        </div>

        <figure className={styles.portraitColumn}>
          <div className={styles.archFrame}>
            <span className={styles.archOutline} aria-hidden="true" />
            {portraitUrl ? (
              <Image
                src={portraitUrl}
                alt={`Portrait of ${name}`}
                width={640}
                height={860}
                className={styles.archImage}
                sizes="(max-width: 900px) 68vw, 320px"
                priority={true}
              />
            ) : (
              <div className={styles.archImage} role="img" aria-label="Portrait placeholder" />
            )}
          </div>

          <figcaption className={styles.glassCard}>
            <div className={styles.glassCardTop} aria-hidden="true" />
            <div className={styles.glassCardRow}>
              <span className={styles.glassCardLabel}>Now</span>
              <span className={styles.glassCardValue}>{name}</span>
            </div>
            <div className={styles.glassCardRow}>
              <span className={styles.glassCardLabel}>Since</span>
              <span className={styles.glassCardValue}>{formatMonthYear(today) || today}</span>
            </div>
            {profile?.location ? (
              <div className={styles.glassCardRow}>
                <span className={styles.glassCardLabel}>Based in</span>
                <span className={styles.glassCardValue}>
                  <MapPin size={12} aria-hidden={true} /> {profile.location}
                </span>
              </div>
            ) : null}
            <ul className={styles.glassLinks}>
              {cvUrl ? (
                <li>
                  <a href={cvUrl} target="_blank" rel="noreferrer" aria-label="Download CV">
                    <FileText size={14} aria-hidden={true} />
                  </a>
                </li>
              ) : null}
              {socialLinks.slice(0, 4).map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.platform}
                  >
                    <SocialGlyph platform={link.platform} />
                  </a>
                </li>
              ))}
            </ul>
          </figcaption>
        </figure>
      </div>

      <Link href="#projects" className={styles.scrollHint} aria-label="Scroll to projects">
        Scroll
      </Link>
    </section>
  )
}

function SocialGlyph({ platform }: { platform: string }) {
  const icon = platformIcon(platform)
  return (
    <>
      {icon}
      <SquareArrowOutUpRight size={9} aria-hidden={true} className={styles.extIcon} />
    </>
  )
}

function platformIcon(platform: string) {
  const value = platform.toLowerCase()
  if (value.includes('github')) return <GitBranch size={14} aria-hidden={true} />
  if (value.includes('linkedin')) return <Briefcase size={14} aria-hidden={true} />
  return <SquareArrowOutUpRight size={14} aria-hidden={true} />
}

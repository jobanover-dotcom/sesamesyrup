import type { Technology } from '@/features/portfolio/types'
import styles from './Marquee.module.css'

/**
 * Continuous horizontal ticker of visible technologies. Content arrives
 * server-rendered and is duplicated once for the seamless CSS loop.
 */
export function TechnologyMarquee({ technologies }: { technologies: Technology[] }) {
  if (technologies.length === 0) return null

  const items = technologies.slice(0, 16)

  return (
    <div className={styles.marquee} aria-hidden={true}>
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <div className={styles.group} key={copy}>
            {items.map((technology) => (
              <span className={styles.item} key={`${copy}-${technology.id}`}>
                {technology.name}
                <span className={styles.separator}>&middot;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

import type { Technology } from '@/features/portfolio/types'
import { techIcon } from '@/features/portfolio/techIcon'
import styles from './TechnologiesGrid.module.css'

const ORDER = [
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Databases',
  'UI/UX Design',
  'Development Tools',
  'Other Technologies',
]

/**
 * Monochromatic bento grid: each technology category becomes a glass panel
 * with numbered index and single-tone icon list.
 */
export function TechnologiesGrid({ technologies }: { technologies: Technology[] }) {
  const grouped = new Map<string, Technology[]>()
  for (const technology of technologies) {
    const key = ORDER.includes(technology.category) ? technology.category : 'Other Technologies'
    grouped.set(key, [...(grouped.get(key) ?? []), technology])
  }
  const grids = ORDER.filter((category) => grouped.has(category))

  return (
    <div className={styles.bento}>
      {grids.map((category, index) => (
        <section
          key={category}
          className={styles.panel}
          data-index={index}
          aria-label={category}
        >
          <header className={styles.panelHead}>
            <span className={styles.panelIndex}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.panelTitle}>{category}</h3>
          </header>

          <ul className={styles.list}>
            {grouped.get(category)!.map((technology) => (
              <li key={technology.id} className={styles.item}>
                {technology.icon ? (
                  <span className={styles.icon} aria-hidden={true}>
                    {techIcon(technology.icon)}
                  </span>
                ) : (
                  <span className={styles.iconDot} aria-hidden={true} />
                )}
                <span className={styles.itemName}>{technology.name}</span>
                {technology.description ? (
                  <span className={styles.itemNote} title={technology.description}>
                    {technology.description}
                  </span>
                ) : null}
                {technology.proficiency !== null ? (
                  <span
                    className={styles.proficiency}
                    role="img"
                    aria-label={`Proficiency ${technology.proficiency} out of 100`}
                  >
                    <span className={styles.proficiencyFill} style={{ width: `${technology.proficiency}%` }} />
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

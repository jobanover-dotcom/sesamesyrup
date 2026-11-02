'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Category, Project } from '@/features/portfolio/types'
import { cn } from '@/lib/utils'
import { ProjectCard } from './ProjectCard'
import { ProjectQuickView } from './ProjectQuickView'
import styles from './ProjectsExplorer.module.css'

type FilterValue = string // 'all' or category id

/**
 * Client-side project gallery: category filter chips, grayscale→color cards
 * with cursor spotlight, and a native <dialog> quick view shared with the
 * dedicated /projects/[slug] route.
 */
export function ProjectsExplorer({
  projects,
  categories,
}: {
  projects: Project[]
  categories: Category[]
}) {
  const [filter, setFilter] = useState<FilterValue>('all')
  const [active, setActive] = useState<Project | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  // Cursor spotlight: delegate pointer tracking once for the whole grid.
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const root = gridRef.current
    if (!root) return
    const onMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-spot]')
      if (!target) return
      const rect = target.getBoundingClientRect()
      target.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
      target.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
    }
    root.addEventListener('pointermove', onMove)
    return () => root.removeEventListener('pointermove', onMove)
  }, [])

  const visible = useMemo(() => {
    if (filter === 'all') return projects
    const id = Number(filter)
    return projects.filter((project) => project.category_id === id)
  }, [filter, projects])

  const openProject = useCallback((project: Project) => setActive(project), [])

  const close = useCallback(() => setActive(null), [])

  return (
    <div className={styles.root}>
      <div className={styles.filterRow} role="group" aria-label="Filter projects by category">
        <FilterChip
          label="All"
          count={projects.length}
          selected={filter === 'all'}
          onSelect={() => setFilter('all')}
        />
        {categories.map((category) => {
          const count = projects.filter((project) => project.category_id === category.id).length
          return (
            <FilterChip
              key={category.id}
              label={category.name}
              count={count}
              selected={filter === String(category.id)}
              onSelect={() => setFilter(String(category.id))}
            />
          )
        })}
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>
          No published projects in this category yet.
        </p>
      ) : (
        <div ref={gridRef} className={styles.grid}>
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              wide={project.is_featured}
              onOpen={openProject}
            />
          ))}
        </div>
      )}

      <ProjectQuickView project={active} onClose={close} />
    </div>
  )
}

function FilterChip({
  label,
  count,
  selected,
  onSelect,
}: {
  label: string
  count: number
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className={cn(styles.chip, selected && styles.chipSelected)}
      aria-pressed={selected}
      onClick={onSelect}
    >
      {label}
      <span className={styles.chipCount}>{count}</span>
    </button>
  )
}

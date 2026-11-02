'use client'

import { cn } from '@/lib/utils'
import ui from '../ui.module.css'
import shared from '@/components/ui/ui-shared.module.css'

export function TechMultiSelect({
  technologies,
  selected,
}: {
  /** Minimal shape: everything is server-provided. */
  technologies: { id: number; name: string; category: string }[]
  selected: number[]
}) {
  const selectedSet = new Set(selected)
  const grouped = new Map<string, { id: number; name: string }[]>()
  for (const technology of technologies) {
    const list = grouped.get(technology.category) ?? []
    list.push(technology)
    grouped.set(technology.category, list)
  }

  return (
    <div className={shared.group} role="group" aria-label="Technologies used">
      <span className={ui.label}>Technologies</span>
      <div className={ui.techGrid}>
        {[...grouped.entries()].map(([category, items]) => (
          <fieldset key={category} className={ui.techGroup}>
            <legend className={shared.monolabel}>{category}</legend>
            {items.map((technology) => (
              <label key={technology.id} className={cn(ui.checkItem)}>
                <input
                  type="checkbox"
                  name="tech_ids"
                  value={technology.id}
                  defaultChecked={selectedSet.has(technology.id)}
                />
                <span>{technology.name}</span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <p className={ui.hint}>Unchecked technologies are detached from this project.</p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { slugify } from '@/lib/utils'
import ui from '../ui.module.css'

/** Title input + auto-generated, still editable slug input. */
export function SlugField({
  titleValue,
  slugValue,
}: {
  titleValue?: string
  slugValue?: string
}) {
  const [slug, setSlug] = useState(slugValue ?? '')
  const [manualOverride, setManualOverride] = useState(Boolean(slugValue))

  return (
    <>
      <div className={ui.field}>
        <label className={ui.label} htmlFor="project-title">
          Title
        </label>
        <input
          id="project-title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={titleValue ?? ''}
          className={ui.input}
          onChange={(event) => {
            if (!manualOverride) {
              setSlug(slugify(event.target.value))
            }
          }}
        />
      </div>

      <div className={ui.field}>
        <label className={ui.label} htmlFor="project-slug">
          Slug (URL path /projects/&lt;slug&gt;)
        </label>
        <input
          id="project-slug"
          name="slug"
          type="text"
          required
          maxLength={120}
          value={slug}
          onChange={(event) => {
            setManualOverride(true)
            setSlug(event.target.value)
          }}
          className={cn(ui.input, ui.mono)}
        />
        {!slug ? (
          <p className={ui.hint}>Auto-generated from the title once you type one.</p>
        ) : null}
      </div>
    </>
  )
}

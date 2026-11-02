'use client'

import { useActionState, useState } from 'react'
import type { AdminResult } from '../repository'
import ui from '../ui.module.css'

/**
 * Toggle for publish/state flags in admin lists. Calls the provided server
 * action with the new value; optimistic until result arrives.
 */
export function RowToggle({
  action,
  checked,
  labelOn,
  labelOff,
  title,
}: {
  action: (value: boolean) => Promise<AdminResult>
  checked: boolean
  labelOn: string
  labelOff: string
  title: string
}) {
  const [, formAction, pending] = useActionState<AdminResult | null, FormData>(
    async (_previous, formData) => await action(formData.get('value') === '1'),
    null,
  )
  const [optimistic, setOptimistic] = useState(checked)

  return (
    <form
      action={(formData) => {
        setOptimistic((current) => !current)
        formAction(formData)
      }}
    >
      <input type="hidden" name="value" value={optimistic ? '0' : '1'} />
      <button
        type="submit"
        disabled={pending}
        className={ui.toggleButton}
        data-on={optimistic || undefined}
        title={title}
      >
        {optimistic ? labelOn : labelOff}
      </button>
    </form>
  )
}

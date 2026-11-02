'use client'

import { Delete, LoaderCircle } from 'lucide-react'
import { useActionState, type ReactNode } from 'react'
import type { AdminResult } from '../repository'
import ui from '../ui.module.css'

/**
 * Button that asks for confirmation before running a destructive server
 * action. Announces state; the parent list refreshes via revalidatePath.
 */
export function ConfirmAction({
  action,
  label,
  confirmMessage,
  icon = <Delete size={14} aria-hidden={true} />,
}: {
  action: () => Promise<AdminResult>
  label: string
  confirmMessage: string
  icon?: ReactNode
}) {
  const [state, formAction, pending] = useActionState(async () => await action(), null)

  return (
    <form action={formAction}>
      <button
        type="submit"
        className={ui.ghostButton}
        disabled={pending}
        onClick={(event) => {
          if (!window.confirm(confirmMessage)) {
            event.preventDefault()
          }
        }}
      >
        {pending ? (
          <LoaderCircle size={14} className={ui.spin} aria-hidden={true} />
        ) : (
          icon
        )}
        {pending ? 'Working…' : label}
      </button>
      {state && !state.ok ? (
        <p role="alert" className={ui.statusError}>
          {state.message}
        </p>
      ) : null}
    </form>
  )
}

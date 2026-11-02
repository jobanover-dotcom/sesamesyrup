'use client'

import { useActionState, type ReactNode } from 'react'
import { CheckCircle2, TriangleAlert, LoaderCircle } from 'lucide-react'
import type { AdminResult } from '../repository'
import ui from '../ui.module.css'
/**
 * Client binder for admin server actions. Renders the form, keeps a pending
 * state and surfaces the server action result as an inline status line.
 */
export function AdminForm({
  action,
  children,
  submitLabel = 'Save',
  footer,
  className,
}: {
  action: (formData: FormData) => Promise<AdminResult>
  children: ReactNode
  submitLabel?: string
  footer?: ReactNode
  className?: string
}) {
  const [state, formAction, pending] = useActionState(
    (_previous: AdminResult | null, formData: FormData) => action(formData),
    null,
  )
  const current: AdminResult | null = state

  return (
    <form action={formAction} className={`${ui.form} ${className ?? ''}`} noValidate={false}>
      {children}
      <div className={ui.formFooter}>
        {footer}
        <button type="submit" className={ui.primaryButton} disabled={pending}>
          {pending ? (
            <LoaderCircle size={14} className={ui.spin} aria-hidden={true} />
          ) : null}
          {pending ? 'Saving…' : submitLabel}
        </button>
      </div>
      {current ? (
        <p
          role="status"
          aria-live="polite"
          className={current.ok ? ui.statusOk : ui.statusError}
        >
          {current.ok ? (
            <CheckCircle2 size={14} aria-hidden={true} />
          ) : (
            <TriangleAlert size={14} aria-hidden={true} />
          )}
          {current.message}
        </p>
      ) : null}
    </form>
  )
}

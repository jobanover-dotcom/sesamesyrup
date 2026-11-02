'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, LoaderCircle, TriangleAlert } from 'lucide-react'
import styles from './ContactForm.module.css'

type Status = 'idle' | 'sending' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Contact form delivered through Formspree. Endpoint comes from the
 * server-rendered env value; a honeypot field and privacy of the user's
 * audience settings provide pragmatic spam resistance.
 */
export function ContactForm({ endpoint }: { endpoint: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const subject = String(data.get('subject') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const nextErrors: Record<string, string> = {}
    if (name.length < 2) nextErrors.name = 'Please enter your name.'
    if (!EMAIL_RE.test(email)) nextErrors.email = 'Please enter a valid email address.'
    if (subject.length < 3) nextErrors.subject = 'Please enter a subject.'
    if (message.length < 10) nextErrors.message = 'Please write a message (10+ characters).'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus('idle')
      return
    }

    setErrors({})
    setStatus('sending')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (response.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {/* Honeypot: bots routinely fill every input. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Company
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={errors.name ? `${styles.input} ${styles.invalid}` : styles.input}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {errors.name ? (
            <p id="contact-name-error" role="alert" className={styles.errorText}>
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={errors.email ? `${styles.input} ${styles.invalid}` : styles.input}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
          />
          {errors.email ? (
            <p id="contact-email-error" role="alert" className={styles.errorText}>
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-subject">
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          maxLength={120}
          className={errors.subject ? `${styles.input} ${styles.invalid}` : styles.input}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
        />
        {errors.subject ? (
          <p id="contact-subject-error" role="alert" className={styles.errorText}>
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          className={errors.message ? `${styles.textarea} ${styles.invalid}` : styles.textarea}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message ? (
          <p id="contact-message-error" role="alert" className={styles.errorText}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className={styles.submitRow}>
        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'sending'}
        >
          {status === 'sending' ? (
            <LoaderCircle size={14} className={styles.spin} aria-hidden={true} />
          ) : null}
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>

        <p aria-live="polite" role="status" className={styles.statusNote}>
          {status === 'success' ? (
            <span className={styles.successNote}>
              <CheckCircle2 size={14} aria-hidden={true} />
              Message sent. I will get back to you soon.
            </span>
          ) : null}
          {status === 'error' ? (
            <span className={styles.errorNote}>
              <TriangleAlert size={14} aria-hidden={true} />
              Sending failed. Try again or email me directly.
            </span>
          ) : null}
        </p>
      </div>
    </form>
  )
}

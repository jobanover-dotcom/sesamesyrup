import { clsx, type ClassValue } from 'clsx'

/** Compose class names. */
export function cn(...classes: ClassValue[]) {
  return clsx(classes)
}

/** URL-friendly slug from an arbitrary title. */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

/**
 * Format an ISO date string as an editorial date, e.g. "March 2024".
 * Returns the raw string if unparseable.
 */
export function formatDate(iso: string | null | undefined, locale = 'en-US'): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date)
}

/** Format a year-only, month-only style "2024 · March" ordering value. */
export function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date)
}

/** Narrow a possibly-unknown value to a string, defaulting sparingly. */
export function toDisplay(value: string | null | undefined, fallback = ''): string {
  return value && value.trim().length > 0 ? value : fallback
}

/**
 * Validate that a string is an http(s) URL. Used at admin boundaries so
 * javascript:, data:, or malformed URLs never reach public markup.
 */
export function safeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

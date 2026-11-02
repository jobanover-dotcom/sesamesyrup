import { ADMIN_FAIL, type AdminResult } from '../repository'

/** Read a single text field from a form submission, defaulting to ''. */
export function text(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

/** Generic Zod parse failure message (field details are logged server-side). */
export function parseFail(): AdminResult {
  return ADMIN_FAIL('Some fields are missing or invalid. Check the form and try again.')
}

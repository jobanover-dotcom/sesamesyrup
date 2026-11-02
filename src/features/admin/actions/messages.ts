/** User-facing auth error copy stays server-safe (plain string, not an action). */
export function describeAuthError(code: string): string {
  switch (code) {
    case 'missing_credentials':
      return 'Enter your email and password.'
    case 'setup':
      return 'Supabase is not configured yet. Ask the administrator to complete setup.'
    case 'forbidden':
      return 'This account is not authorised for the control room.'
    case 'invalid_credentials':
    default:
      return 'Sign-in failed. Check your details and try again.'
  }
}

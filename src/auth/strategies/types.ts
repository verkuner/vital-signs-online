import type { AuthUser } from '../../services/authService'

export type AuthMode = 'backend' | 'oidc'

export interface AuthStrategy {
  readonly mode: AuthMode

  /**
   * Restore an existing session, if any. Called once on app load.
   * Returns the authenticated user, or null when no valid session exists.
   */
  init(): Promise<AuthUser | null>

  /**
   * Begin a sign-in.
   * - backend mode: completes inline; resolves with the authenticated user
   * - oidc mode: redirects the browser; never resolves (control transfers to KeyCloak)
   */
  login(creds?: { email: string; password: string }): Promise<AuthUser | void>

  /**
   * Self-service registration. Only present in backend mode; OIDC delegates
   * registration to KeyCloak's account console.
   */
  register?(input: { email: string; password: string; name: string }): Promise<AuthUser>

  /**
   * Sign out and clear local session state.
   * - backend mode: revokes refresh token and clears localStorage
   * - oidc mode: redirects to KeyCloak's end-session endpoint
   */
  logout(): Promise<void>

  /**
   * Synchronously return the current access token for outgoing API calls,
   * or null if not authenticated.
   */
  getAccessToken(): string | null
}

export type { AuthUser }

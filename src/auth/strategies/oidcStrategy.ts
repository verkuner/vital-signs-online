import { UserManager, WebStorageStateStore, type User as OidcUser } from 'oidc-client-ts'
import type { AuthUser } from '../../services/authService'
import type { AuthStrategy } from './types'

function buildUserManager(): UserManager {
  const authority = import.meta.env.VITE_OIDC_AUTHORITY
  const clientId = import.meta.env.VITE_OIDC_CLIENT_ID
  const redirectUri = import.meta.env.VITE_OIDC_REDIRECT_URI
  const postLogoutRedirectUri = import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI

  if (!authority || !clientId || !redirectUri) {
    throw new Error(
      'OIDC mode requires VITE_OIDC_AUTHORITY, VITE_OIDC_CLIENT_ID, and VITE_OIDC_REDIRECT_URI',
    )
  }

  return new UserManager({
    authority,
    client_id: clientId,
    redirect_uri: redirectUri,
    post_logout_redirect_uri: postLogoutRedirectUri || window.location.origin,
    response_type: 'code',
    scope: 'openid profile email',
    loadUserInfo: true,
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  })
}

function mapOidcUser(u: OidcUser): AuthUser {
  const profile = u.profile as Record<string, unknown>
  const realmAccess = profile.realm_access as { roles?: string[] } | undefined
  const role = realmAccess?.roles?.[0] || 'authenticated'

  return {
    id: String(profile.sub || ''),
    email: String(profile.email || profile.preferred_username || ''),
    name: String(profile.name || profile.preferred_username || profile.email || ''),
    avatar: typeof profile.picture === 'string' ? profile.picture : undefined,
    role,
  }
}

export class OidcStrategy implements AuthStrategy {
  readonly mode = 'oidc' as const

  private readonly userManager: UserManager
  private cachedUser: OidcUser | null = null

  constructor() {
    this.userManager = buildUserManager()

    this.userManager.events.addUserLoaded((user) => {
      this.cachedUser = user
    })
    this.userManager.events.addUserUnloaded(() => {
      this.cachedUser = null
    })
    this.userManager.events.addUserSignedOut(() => {
      this.cachedUser = null
    })
    this.userManager.events.addAccessTokenExpired(() => {
      // automaticSilentRenew handles the renewal; if it fails, force re-login
      this.userManager.signinRedirect().catch(() => {
        this.cachedUser = null
      })
    })
  }

  async init(): Promise<AuthUser | null> {
    const user = await this.userManager.getUser()
    if (!user || user.expired) {
      this.cachedUser = null
      return null
    }
    this.cachedUser = user
    return mapOidcUser(user)
  }

  async login(): Promise<void> {
    await this.userManager.signinRedirect()
  }

  async logout(): Promise<void> {
    this.cachedUser = null
    await this.userManager.signoutRedirect()
  }

  getAccessToken(): string | null {
    if (!this.cachedUser || this.cachedUser.expired) return null
    return this.cachedUser.access_token
  }

  /**
   * Complete the OIDC redirect callback. Used only by the /callback route.
   */
  async completeSignin(): Promise<AuthUser> {
    const user = await this.userManager.signinRedirectCallback()
    this.cachedUser = user
    return mapOidcUser(user)
  }
}

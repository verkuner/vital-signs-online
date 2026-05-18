import {
  apiGetMe,
  apiLogin,
  apiLogout,
  apiRegister,
  type AuthUser,
} from '../../services/authService'
import type { AuthStrategy } from './types'

export class BackendStrategy implements AuthStrategy {
  readonly mode = 'backend' as const

  async init(): Promise<AuthUser | null> {
    const token = localStorage.getItem('auth_token')
    if (!token) return null
    try {
      return await apiGetMe()
    } catch {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      return null
    }
  }

  async login(creds?: { email: string; password: string }): Promise<AuthUser> {
    if (!creds) {
      throw new Error('backend login requires email and password')
    }
    const { user } = await apiLogin(creds.email, creds.password)
    return user
  }

  async register(input: { email: string; password: string; name: string }): Promise<AuthUser> {
    const { user } = await apiRegister(input.email, input.password, input.name)
    return user
  }

  async logout(): Promise<void> {
    await apiLogout()
  }

  getAccessToken(): string | null {
    return localStorage.getItem('auth_token')
  }
}

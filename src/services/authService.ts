import { post, get } from './apiClient'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
}

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user_id: string
}

interface UserMeResponse {
  data: {
    id: string
    provider_id: string
    email: string
    name: string
    date_of_birth?: string
    avatar_url?: string
    created_at: string
    updated_at: string
  }
}

function storeTokens(tokens: TokenResponse) {
  localStorage.setItem('auth_token', tokens.access_token)
  localStorage.setItem('refresh_token', tokens.refresh_token)
}

function mapUserResponse(u: UserMeResponse['data']): AuthUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name || u.email,
    avatar: u.avatar_url,
    role: 'authenticated',
  }
}

export async function apiLogin(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const tokens = await post<TokenResponse>('/auth/login', { email, password })
  storeTokens(tokens)
  const me = await get<UserMeResponse>('/users/me')
  return { token: tokens.access_token, user: mapUserResponse(me.data) }
}

export async function apiRegister(
  email: string,
  password: string,
  name: string,
): Promise<{ token: string; user: AuthUser }> {
  const tokens = await post<TokenResponse>('/auth/register', { email, password, name })
  storeTokens(tokens)
  const me = await get<UserMeResponse>('/users/me')
  return { token: tokens.access_token, user: mapUserResponse(me.data) }
}

export async function apiGetMe(): Promise<AuthUser | null> {
  try {
    const me = await get<UserMeResponse>('/users/me')
    return mapUserResponse(me.data)
  } catch {
    return null
  }
}

export async function apiLogout(): Promise<void> {
  const refreshToken = localStorage.getItem('refresh_token')
  try {
    if (refreshToken) {
      await post('/auth/logout', { refresh_token: refreshToken })
    }
  } finally {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }
}

export async function apiRefreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return false
  try {
    const tokens = await post<TokenResponse>('/auth/refresh', { refresh_token: refreshToken })
    storeTokens(tokens)
    return true
  } catch {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    return false
  }
}

export async function apiForgotPassword(email: string): Promise<void> {
  await post('/auth/forgot-password', { email })
}

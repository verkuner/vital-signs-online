import { get, post, del } from './apiClient'
import { User } from './mockData'

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

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user_id: string
}

function mapApiUser(u: UserMeResponse['data']): User {
  return {
    id: u.id,
    name: u.name || u.email,
    email: u.email,
    role: 'User',
    status: 'active' as const,
    avatar: u.avatar_url,
    joinedAt: u.created_at.split('T')[0],
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const res = await get<UserMeResponse>('/users/me')
    return [mapApiUser(res.data)]
  } catch {
    return []
  }
}

export async function deleteUser(_userId: string) {
  await del(`/users/me`)
  return true
}

export async function createUser(input: { name: string; email: string; password: string }): Promise<User> {
  const tokens = await post<TokenResponse>('/auth/register', {
    email: input.email,
    password: input.password,
    name: input.name,
  })

  const BASE = import.meta.env.VITE_API_URL || '/api/v1'
  const meRes = await fetch(`${BASE}/users/me`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  if (!meRes.ok) {
    return {
      id: tokens.user_id,
      name: input.name,
      email: input.email,
      role: 'User',
      status: 'active',
      joinedAt: new Date().toISOString().split('T')[0],
    }
  }

  const me: UserMeResponse = await meRes.json()
  return mapApiUser(me.data)
}

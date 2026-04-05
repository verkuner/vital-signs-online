import { get, del } from './apiClient'
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

export async function getUsers(): Promise<User[]> {
  try {
    const res = await get<UserMeResponse>('/users/me')
    const u = res.data
    return [
      {
        id: u.id,
        name: u.name || u.email,
        email: u.email,
        role: 'User',
        status: 'active' as const,
        avatar: u.avatar_url,
        joinedAt: u.created_at.split('T')[0],
      },
    ]
  } catch {
    return []
  }
}

export async function deleteUser(_userId: string) {
  await del(`/users/me`)
  return true
}

export async function createUser(newUser: User) {
  return newUser
}

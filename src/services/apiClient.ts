import { getAuthStrategy } from '../auth/strategies'

const BASE = import.meta.env.VITE_API_URL || '/api/v1'

function getToken(): string | null {
  return getAuthStrategy().getAccessToken()
}

function authHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ code: 'unknown', message: response.statusText }))
    throw new ApiError(response.status, body.code ?? 'unknown', body.message ?? response.statusText)
  }
  const text = await response.text()
  return text ? JSON.parse(text) : ({} as T)
}

export async function get<T>(path: string, query?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`, window.location.origin)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, v)
    }
  }
  const res = await fetch(url.toString(), { headers: { ...authHeaders() } })
  return handleResponse<T>(res)
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}

export async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
  return handleResponse<T>(res)
}

export async function del<T = void>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  return handleResponse<T>(res)
}

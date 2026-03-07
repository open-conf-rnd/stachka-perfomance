import { apiBase } from '../config'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

function getInitData(): string {
  return window.Telegram?.WebApp?.initData ?? ''
}

export async function apiRequest<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<T> {
  const url = apiBase ? `${apiBase}${path}` : path
  const hasBody = method !== 'GET' && body !== undefined
  const bodySerialized =
    method === 'GET' ? undefined : hasBody ? JSON.stringify(body) : '{}'

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-init-data': getInitData(),
    },
    body: bodySerialized,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message = payload?.error || `HTTP ${response.status}`
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export interface MeResponse {
  registered: boolean
  user: {
    id: string
    username?: string | null
    firstName: string
    lastName?: string | null
    photoUrl?: string | null
  } | null
}

export interface RegisterResponse {
  registered: boolean
  isNew: boolean
  user: {
    id: string
    username?: string | null
    firstName: string
    lastName?: string | null
    photoUrl?: string | null
  }
}

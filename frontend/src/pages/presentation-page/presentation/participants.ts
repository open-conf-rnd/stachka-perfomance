import { apiBase } from '@/config'
import { apiRequest } from '@/shared/lib/api'
import { getApiAuthHeaders } from '@/shared/lib/authHeaders'

export interface Participant {
  id: string
  firstName: string
  lastName: string | null
  username: string | null
  photoUrl?: string | null
  completionsCount?: number
}

/** Участники для админки (требует x-telegram-init-data или x-vk-launch-params). */
export async function fetchParticipants(): Promise<Participant[]> {
  if (typeof window !== 'undefined' && Object.keys(getApiAuthHeaders()).length === 0) {
    return []
  }
  try {
    return await apiRequest<Participant[]>('/api/admin/participants')
  } catch {
    return []
  }
}

/** Участники для экрана презентации (по display-токену, без Telegram). */
export async function fetchDisplayParticipants(token: string): Promise<Participant[]> {
  const base = apiBase || ''
  const url = `${base}/api/display/participants?token=${encodeURIComponent(token)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Display token invalid or missing')
  return res.json() as Promise<Participant[]>
}

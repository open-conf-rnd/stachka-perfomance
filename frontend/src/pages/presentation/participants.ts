import { apiRequest } from '../../lib/api'
import { apiBase } from '../../config'

export interface Participant {
  id: string
  firstName: string
  lastName: string | null
  username: string | null
  photoUrl?: string | null
  completionsCount?: number
}

export async function fetchParticipants(displayToken?: string): Promise<Participant[]> {
  if (displayToken) {
    const url = apiBase
      ? `${apiBase}/api/display/participants?token=${encodeURIComponent(displayToken)}`
      : `/api/display/participants?token=${encodeURIComponent(displayToken)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Не удалось загрузить участников')
    return res.json()
  }
  try {
    return await apiRequest<Participant[]>('/api/admin/participants')
  } catch {
    return []
  }
}

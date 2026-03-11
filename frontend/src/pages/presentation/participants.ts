import { apiRequest } from '../../lib/api'

export interface Participant {
  id: string
  firstName: string
  lastName: string | null
  username: string | null
  photoUrl?: string | null
  completionsCount?: number
}

export async function fetchParticipants(): Promise<Participant[]> {
  try {
    return await apiRequest<Participant[]>('/api/admin/participants')
  } catch {
    return []
  }
}

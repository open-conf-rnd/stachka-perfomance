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

export interface TapAggregate {
  total: number
  goal: number
}

/** Суммарные тапы для слайда презентации (публично, без display-токена). */
export async function fetchTapAggregate(): Promise<TapAggregate> {
  const base = apiBase || ''
  const res = await fetch(`${base}/api/tap/aggregate`)
  if (!res.ok) throw new Error('Не удалось загрузить счётчик тапов')
  return res.json() as Promise<TapAggregate>
}

export interface Merge2048LeaderboardUser {
  firstName: string
  username: string | null
}

export interface Merge2048LeaderboardItem {
  place: number
  userId: string
  user: Merge2048LeaderboardUser
  bestMaxTile: number
  bestScore: number
  gamesPlayed: number
}

export interface Merge2048LeaderboardResponse {
  items: Merge2048LeaderboardItem[]
}

/** Топ 2048 для слайда презентации (публично, без авторизации). */
export async function fetchMerge2048Leaderboard(limit = 10): Promise<Merge2048LeaderboardResponse> {
  const base = apiBase || ''
  const url = `${base}/api/merge2048/leaderboard?limit=${limit}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Не удалось загрузить рейтинг 2048 (HTTP ${res.status}). URL: ${url || '/api/merge2048/leaderboard'}`)
  }
  return res.json() as Promise<Merge2048LeaderboardResponse>
}

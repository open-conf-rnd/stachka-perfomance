import { apiRequest } from '@/shared/lib/api'

/** Текущий прогресс партии: обновляет на сервере лучшие maxTile и счёт без +1 к числу игр. */
export async function postMerge2048Progress(maxTile: number, score: number): Promise<void> {
  try {
    await apiRequest<{ ok: boolean }>('/api/merge2048/progress', 'POST', { maxTile, score })
  } catch {
    // без init-data или офлайн — не мешаем игре
  }
}

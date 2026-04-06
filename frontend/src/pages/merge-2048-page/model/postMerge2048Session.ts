import { apiRequest } from '@/shared/lib/api'

/** Отправка партии на сервер (лидерборд). Ошибки сети/авторизации игнорируем. */
export async function postMerge2048Session(maxTile: number, score: number): Promise<void> {
  try {
    await apiRequest<{ ok: boolean }>('/api/merge2048/session', 'POST', { maxTile, score })
  } catch {
    // без init-data или офлайн — не мешаем игре
  }
}

import { useState } from 'react'
import { apiRequest } from '@/shared/lib/api'

export function useBehavior() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tapSessionLoading, setTapSessionLoading] = useState(false)
  const [tapSessionError, setTapSessionError] = useState<string | null>(null)
  const [tapSessionResult, setTapSessionResult] = useState<string | null>(null)

  const startRound = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await apiRequest<{
        success: boolean
        roundId: string
        countdownSeconds: number
        leaderboardDelaySeconds: number
      }>('/api/reaction/start', 'POST')
      setResult(
        `Раунд запущен. ID: ${data.roundId}. Обратный отсчёт: ${data.countdownSeconds} сек.`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось запустить')
    } finally {
      setLoading(false)
    }
  }

  const setTapSession = async (open: boolean) => {
    setTapSessionLoading(true)
    setTapSessionResult(null)
    setTapSessionError(null)
    try {
      await apiRequest<{ success: boolean; open: boolean }>('/api/tap/session', 'POST', { open })
      setTapSessionResult(open ? 'Тапы открыты — можно тапать.' : 'Тапы закрыты. Фальстарт списывает тап со счёта участника.')
    } catch (err) {
      setTapSessionError(err instanceof Error ? err.message : 'Не удалось изменить режим тапалки')
    } finally {
      setTapSessionLoading(false)
    }
  }

  return {
    loading,
    result,
    error,
    startRound,
    tapSessionLoading,
    tapSessionError,
    tapSessionResult,
    setTapSession,
  }
}

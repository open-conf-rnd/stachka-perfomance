import { useEffect, useMemo, useRef, useState } from 'react'
import { apiRequest, apiRequestWithNotifications, type MeResponse } from '@/shared/lib/api'
import { subscribePresentationWs } from '@/shared/lib/presentationWs'
import { notifyTelegramResult } from '@/shared/lib/telegramNotifications'
import type {
  ReactionCurrentRoundResponse,
  ReactionLeaderboardItem,
  ReactionLeaderboardUser,
  ReactionRoundStatus,
} from './types'

export function useReactionPageBehavior() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [roundNumber, setRoundNumber] = useState<number | null>(null)
  const [status, setStatus] = useState<ReactionRoundStatus | 'IDLE'>('IDLE')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [podium, setPodium] = useState<ReactionLeaderboardItem[]>([])
  const [leaderboard, setLeaderboard] = useState<ReactionLeaderboardItem[]>([])
  const [alreadyTapped, setAlreadyTapped] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const canTap = useMemo(
    () => status === 'ACTIVE' && !alreadyTapped && !submitting,
    [status, alreadyTapped, submitting]
  )

  const currentUserIdRef = useRef<string | null>(null)
  useEffect(() => {
    currentUserIdRef.current = currentUserId
  }, [currentUserId])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const me = await apiRequest<MeResponse>('/api/me').catch(() => null)
        const data = await apiRequest<ReactionCurrentRoundResponse>('/api/reaction/current')
        if (!active) return
        setCurrentUserId(me?.user?.id ?? null)
        if (data.round) {
          setRoundNumber(data.round.roundNumber ?? null)
          setStatus(data.round.status)
          if (data.round.status === 'PENDING' && typeof data.round.secondsRemaining === 'number') {
            setCountdown(data.round.secondsRemaining)
          } else {
            setCountdown(null)
          }
        } else {
          setRoundNumber(null)
          setStatus('IDLE')
          setCountdown(null)
        }
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Не удалось загрузить текущий раунд')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const unsubscribe = subscribePresentationWs((msg) => {
      try {
        if (msg.type === 'reaction:countdown' && msg.payload && typeof msg.payload === 'object') {
          const payload = msg.payload as {
            roundId: string
            roundNumber?: number
            seconds: number
          }
          setRoundNumber(payload.roundNumber ?? null)
          setStatus('PENDING')
          setCountdown(payload.seconds)
          setPodium([])
          setLeaderboard([])
          setAlreadyTapped(false)
        }

        if (msg.type === 'reaction:go' && msg.payload && typeof msg.payload === 'object') {
          const payload = msg.payload as { roundId: string; roundNumber?: number }
          setRoundNumber(payload.roundNumber ?? null)
          setStatus('ACTIVE')
          setCountdown(null)
        }

        if (msg.type === 'reaction:podium' && msg.payload && typeof msg.payload === 'object') {
          const payload = msg.payload as { roundId: string; place: number; user: ReactionLeaderboardUser }
          if (payload.user.id === currentUserIdRef.current) {
            notifyTelegramResult('success', 'Ты в топ-3 реакции, бинго-задание засчитано', 'Бинго')
          }
          setPodium((prev) => {
            const next = prev.filter((item) => item.place !== payload.place)
            next.push({
              place: payload.place,
              user: payload.user,
              tapTime: '',
            })
            return next.sort((a, b) => a.place - b.place)
          })
        }

        if (msg.type === 'reaction:leaderboard' && msg.payload && typeof msg.payload === 'object') {
          const payload = msg.payload as {
            roundId: string
            roundNumber?: number
            results: ReactionLeaderboardItem[]
          }
          setStatus('FINISHED')
          setRoundNumber(payload.roundNumber ?? null)
          setLeaderboard(payload.results)
          setCountdown(null)
        }
      } catch {
        // ignore malformed ws messages
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (countdown === null || countdown <= 0) return
    const timer = setTimeout(() => setCountdown((v) => (v && v > 0 ? v - 1 : 0)), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const onTap = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const data = await apiRequestWithNotifications<{ success: boolean; alreadyTapped: boolean; roundId: string }>(
        '/api/reaction/tap',
        'POST',
        undefined,
        {
          notifyOnSuccess: false,
          errorMessage: 'Не удалось отправить реакцию',
        }
      )
      setAlreadyTapped(Boolean(data.alreadyTapped))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить реакцию')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    roundNumber,
    status,
    countdown,
    podium,
    leaderboard,
    alreadyTapped,
    submitting,
    loading,
    error,
    canTap,
    onTap,
  }
}

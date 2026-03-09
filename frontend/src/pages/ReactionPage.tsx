import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { apiRequest, apiRequestWithNotifications, type MeResponse } from '../lib/api'
import { wsUrl } from '../config'
import { notifyTelegramResult } from '../lib/telegramNotifications'

type RoundStatus = 'PENDING' | 'ACTIVE' | 'FINISHED'

interface CurrentRoundResponse {
  round: {
    id: string
    roundNumber?: number
    status: RoundStatus
  } | null
  tapsCount?: number
}

interface LeaderboardItem {
  place: number
  user: {
    id: string
    firstName: string
    username?: string | null
  }
  tapTime: string
}

export function ReactionPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [roundNumber, setRoundNumber] = useState<number | null>(null)
  const [status, setStatus] = useState<RoundStatus | 'IDLE'>('IDLE')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [podium, setPodium] = useState<LeaderboardItem[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([])
  const [alreadyTapped, setAlreadyTapped] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const canTap = useMemo(() => status === 'ACTIVE' && !alreadyTapped && !submitting, [status, alreadyTapped, submitting])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const me = await apiRequest<MeResponse>('/api/me').catch(() => null)
        const data = await apiRequest<CurrentRoundResponse>('/api/reaction/current')
        if (!active) return
        setCurrentUserId(me?.user?.id ?? null)
        if (data.round) {
          setRoundNumber(data.round.roundNumber ?? null)
          setStatus(data.round.status)
        } else {
          setRoundNumber(null)
          setStatus('IDLE')
        }
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Не удалось загрузить текущий раунд')
      } finally {
        if (active) setLoading(false)
      }
    })()

    const ws = new WebSocket(wsUrl)
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as
          | { type: 'reaction:countdown'; payload?: { roundId: string; roundNumber?: number; seconds: number } }
          | { type: 'reaction:go'; payload?: { roundId: string; roundNumber?: number } }
          | { type: 'reaction:podium'; payload?: { roundId: string; place: number; user: LeaderboardItem['user'] } }
          | { type: 'reaction:leaderboard'; payload?: { roundId: string; roundNumber?: number; results: LeaderboardItem[] } }

        if (msg.type === 'reaction:countdown' && msg.payload) {
          setRoundNumber(msg.payload.roundNumber ?? null)
          setStatus('PENDING')
          setCountdown(msg.payload.seconds)
          setPodium([])
          setLeaderboard([])
          setAlreadyTapped(false)
        }

        if (msg.type === 'reaction:go' && msg.payload) {
          setRoundNumber(msg.payload.roundNumber ?? null)
          setStatus('ACTIVE')
          setCountdown(null)
        }

        if (msg.type === 'reaction:podium' && msg.payload) {
          const payload = msg.payload
          if (payload.user.id === currentUserId) {
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

        if (msg.type === 'reaction:leaderboard' && msg.payload) {
          setStatus('FINISHED')
          setRoundNumber(msg.payload.roundNumber ?? null)
          setLeaderboard(msg.payload.results)
          setCountdown(null)
        }
      } catch {
        // ignore malformed ws messages
      }
    }

    return () => {
      active = false
      ws.close()
    }
  }, [currentUserId])

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

  return (
    <PageLayout title="Реакция" subtitle="CountDown, старт и рейтинг">
      {loading ? <p className="page__loading">Загружаем состояние раунда...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      <p style={{ margin: '0 0 0.75rem' }}>
        {roundNumber != null ? `Раунд №${roundNumber}` : 'Раунда нет'} · статус: {status}
      </p>
      <Link to="/reaction/rounds" className="btn" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
        Посмотреть все раунды
      </Link>
      {countdown !== null && status === 'PENDING' ? (
        <p style={{ margin: '0 0 0.75rem', fontSize: '1.2rem', fontWeight: 700 }}>Старт через: {countdown}</p>
      ) : null}

      <button
        type="button"
        className="btn"
        onClick={onTap}
        disabled={!canTap}
        style={{ width: '100%', minHeight: '120px', fontSize: '1.7rem', marginBottom: '0.75rem' }}
      >
        {submitting ? '...' : 'НАЖАТЬ'}
      </button>
      {alreadyTapped ? <p style={{ margin: '0 0 0.75rem' }}>Твой результат зафиксирован.</p> : null}

      {podium.length > 0 ? (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Первые три:</div>
          {podium.map((item) => (
            <div key={`${item.place}-${item.user.id}`}>
              {item.place}. {item.user.firstName}
              {item.user.username ? ` (@${item.user.username})` : ''}
            </div>
          ))}
        </div>
      ) : null}

      {leaderboard.length > 0 ? (
        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Финальный рейтинг:</div>
          {leaderboard.map((item) => (
            <div key={`${item.place}-${item.user.id}`}>
              {item.place}. {item.user.firstName}
              {item.user.username ? ` (@${item.user.username})` : ''}
            </div>
          ))}
        </div>
      ) : null}
    </PageLayout>
  )
}

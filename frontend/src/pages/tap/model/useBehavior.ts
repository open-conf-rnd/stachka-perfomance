import { useEffect, useMemo, useState } from 'react'
import { apiRequest, apiRequestWithNotifications } from '@/shared/lib/api'
import { wsUrl } from '@/config'

interface TapState {
  userCount: number
  total: number
  goal: number
}

type TapPostResult = TapState & { success: boolean; falseStart?: boolean }

export function useBehavior() {
  const [state, setState] = useState<TapState | null>(null)
  const [sessionOpen, setSessionOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [goalReached, setGoalReached] = useState(false)
  const [falseStartMessage, setFalseStartMessage] = useState<string | null>(null)

  const progress = useMemo(() => {
    if (!state || state.goal <= 0) return 0
    return Math.min(100, Math.round((state.total / state.goal) * 100))
  }, [state])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await apiRequest<TapState & { sessionOpen?: boolean }>('/api/tap')
        if (!active) return
        setState(data)
        if (typeof data.sessionOpen === 'boolean') {
          setSessionOpen(data.sessionOpen)
        }
        setGoalReached(data.total >= data.goal)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Не удалось загрузить счетчик')
      } finally {
        if (active) setLoading(false)
      }
    })()

    const ws = new WebSocket(wsUrl)
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as
          | { type: 'tap:update'; payload?: TapState }
          | { type: 'tap:goal'; payload?: { total: number; goal: number } }
          | { type: 'tap:session'; payload?: { open?: boolean } }
        if (msg.type === 'tap:session' && typeof msg.payload?.open === 'boolean') {
          setSessionOpen(msg.payload.open)
        }
        if (msg.type === 'tap:update' && msg.payload) {
          const payload = msg.payload
          setState((prev) => ({
            userCount: prev?.userCount ?? payload.userCount,
            total: payload.total,
            goal: payload.goal,
          }))
          if (payload.total >= payload.goal) {
            setGoalReached(true)
          }
        }
        if (msg.type === 'tap:goal' && msg.payload) {
          const payload = msg.payload
          setGoalReached(true)
          setState((prev) =>
            prev
              ? { ...prev, total: payload.total, goal: payload.goal }
              : { userCount: 0, total: payload.total, goal: payload.goal }
          )
        }
      } catch {
        // ignore malformed ws messages
      }
    }

    return () => {
      active = false
      ws.close()
    }
  }, [])

  const onTap = async () => {
    const prevUserCount = state?.userCount
    setSubmitting(true)
    setError(null)
    setFalseStartMessage(null)
    try {
      const data = await apiRequestWithNotifications<TapPostResult>(
        '/api/tap',
        'POST',
        undefined,
        {
          successCondition: (response) =>
            typeof response === 'object' &&
            response !== null &&
            'success' in response &&
            (response as { success?: boolean }).success === true &&
            'userCount' in response &&
            typeof (response as { userCount?: unknown }).userCount === 'number' &&
            (response as { userCount: number }).userCount === 10,
          popupTitle: 'Бинго',
          successMessage: '10 тапов набраны, бинго-задание засчитано',
          errorMessage: 'Не удалось отправить тап',
        }
      )
      setState({ userCount: data.userCount, total: data.total, goal: data.goal })
      if (data.total >= data.goal) setGoalReached(true)
      if (data.falseStart) {
        const penalized =
          typeof prevUserCount === 'number' && data.userCount < prevUserCount
        setFalseStartMessage(
          penalized
            ? 'Фальстарт! С твоего счёта списан один тап. Жди сигнал ведущего.'
            : 'Фальстарт! Тапы пока закрыты — жди сигнал ведущего.'
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить тап')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    state,
    loading,
    submitting,
    error,
    goalReached,
    progress,
    onTap,
    sessionOpen,
    falseStartMessage,
  }
}

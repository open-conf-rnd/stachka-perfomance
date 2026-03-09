import { useEffect, useMemo, useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { apiRequest, apiRequestWithNotifications } from '../lib/api'
import { wsUrl } from '../config'

interface TapState {
  userCount: number
  total: number
  goal: number
}

export function TapPage() {
  const [state, setState] = useState<TapState | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [goalReached, setGoalReached] = useState(false)

  const progress = useMemo(() => {
    if (!state || state.goal <= 0) return 0
    return Math.min(100, Math.round((state.total / state.goal) * 100))
  }, [state])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await apiRequest<TapState>('/api/tap')
        if (!active) return
        setState(data)
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
    setSubmitting(true)
    setError(null)
    try {
      const data = await apiRequestWithNotifications<TapState & { success: boolean }>(
        '/api/tap',
        'POST',
        undefined,
        {
          successCondition: (response) =>
            typeof response === 'object' &&
            response !== null &&
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить тап')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout title="Тапалка" subtitle="Большая кнопка и счетчик до цели">
      {loading ? <p className="page__loading">Загружаем счетчики...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {state ? (
        <>
          <button
            type="button"
            className="btn"
            onClick={onTap}
            disabled={submitting}
            style={{
              width: '100%',
              minHeight: '120px',
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '0.9rem',
            }}
          >
            {submitting ? '...' : 'ТАП'}
          </button>
          <p style={{ margin: '0 0 0.4rem' }}>Твои нажатия: {state.userCount}</p>
          <p style={{ margin: '0 0 0.55rem' }}>
            Общий счетчик: {state.total} / {state.goal}
          </p>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.15)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                transition: 'width 0.2s ease',
                background: goalReached ? '#22c55e' : '#3b82f6',
              }}
            />
          </div>
          {goalReached ? (
            <p style={{ margin: '0.7rem 0 0', fontWeight: 700 }}>Цель достигнута! Показываем конфетти на слайде 🎉</p>
          ) : null}
        </>
      ) : null}
    </PageLayout>
  )
}

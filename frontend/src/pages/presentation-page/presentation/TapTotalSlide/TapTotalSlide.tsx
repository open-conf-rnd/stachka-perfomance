import { useEffect, useState } from 'react'
import { subscribePresentationWs } from '@/shared/lib/presentationWs'
import { fetchTapAggregate, type TapAggregate } from '../participants'
import './TapTotalSlide.css'

export function TapTotalSlide() {
  const [totals, setTotals] = useState<TapAggregate | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void fetchTapAggregate()
      .then((data) => {
        if (!cancelled) {
          setTotals(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить')
          setTotals(null)
        }
      })

    const unsub = subscribePresentationWs((msg) => {
      if (msg.type === 'tap:update' && msg.payload && typeof msg.payload === 'object') {
        const p = msg.payload as { total?: number; goal?: number }
        const nextTotal = p.total
        if (typeof nextTotal === 'number') {
          setTotals((prev) => ({
            total: nextTotal,
            goal: typeof p.goal === 'number' ? p.goal : prev?.goal ?? 0,
          }))
        }
      }
      if (msg.type === 'tap:goal' && msg.payload && typeof msg.payload === 'object') {
        const p = msg.payload as { total?: number; goal?: number }
        if (typeof p.total === 'number' && typeof p.goal === 'number') {
          setTotals({ total: p.total, goal: p.goal })
        }
      }
    })

    return () => {
      cancelled = true
      unsub()
    }
  }, [])

  return (
    <div className="tap-total-slide">
      <h2 className="tap-total-slide__title">Тапалка</h2>
      <p className="tap-total-slide__hint">Общее число тапов всех участников</p>
      {error ? (
        <p className="tap-total-slide__error">{error}</p>
      ) : totals === null ? (
        <p className="tap-total-slide__status">Загрузка…</p>
      ) : (
        <>
          <div className="tap-total-slide__value" aria-live="polite">
            {totals.total.toLocaleString('ru-RU')}
          </div>
          {totals.goal > 0 ? (
            <p className="tap-total-slide__goal">
              Цель: {totals.goal.toLocaleString('ru-RU')}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}

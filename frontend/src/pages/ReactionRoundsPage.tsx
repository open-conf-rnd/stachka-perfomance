import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { apiRequest } from '../lib/api'

interface RoundSummary {
  id: string
  roundNumber: number
  status: string
  createdAt: string
  participantsCount: number
}

export function ReactionRoundsPage() {
  const [rounds, setRounds] = useState<RoundSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await apiRequest<RoundSummary[]>('/api/reaction/rounds')
        if (!active) return
        setRounds(data)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Не удалось загрузить раунды')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  const formatDate = (s: string) => {
    try {
      const d = new Date(s)
      return d.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return s
    }
  }

  return (
    <PageLayout title="Все раунды" subtitle="Список раундов «Реакция»">
      {loading ? <p className="page__loading">Загружаем раунды...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {!loading && !error && rounds.length === 0 ? (
        <p>Раундов пока нет.</p>
      ) : null}
      {!loading && rounds.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {rounds.map((r) => (
            <Link
              key={r.id}
              to={`/reaction/rounds/${r.id}`}
              className="grid__item"
              style={{ textDecoration: 'none' }}
            >
              <span className="grid__item-title">
                Раунд №{r.roundNumber}
                {r.roundNumber === 0 ? ` (${r.id.slice(0, 8)}…)` : ''}
              </span>
              <span className="grid__item-desc">
                {r.participantsCount} участников · {formatDate(r.createdAt)} · {r.status}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </PageLayout>
  )
}

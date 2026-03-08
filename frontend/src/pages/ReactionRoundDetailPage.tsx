import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { apiRequest } from '../lib/api'

interface RoundDetail {
  id: string
  roundNumber: number
  status: string
  createdAt: string
  results: Array<{
    place: number
    user: { id: string; firstName: string; username?: string | null }
    tapTime: string
  }>
}

export function ReactionRoundDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [round, setRound] = useState<RoundDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    ;(async () => {
      try {
        const data = await apiRequest<RoundDetail>(`/api/reaction/rounds/${id}`)
        if (!active) return
        setRound(data)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Не удалось загрузить раунд')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [id])

  const formatTime = (s: string) => {
    try {
      const d = new Date(s)
      return d.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return s
    }
  }

  return (
    <PageLayout
      title={round ? `Раунд №${round.roundNumber}` : 'Раунд'}
      subtitle={round ? `Участники и места` : ''}
    >
      {loading ? <p className="page__loading">Загружаем раунд...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {!loading && !error && round ? (
        <>
          <p style={{ margin: '0 0 0.5rem', opacity: 0.9 }}>
            Дата: {new Date(round.createdAt).toLocaleString('ru-RU')}
          </p>
          <p style={{ margin: '0 0 0.75rem', opacity: 0.9 }}>
            Всего участников: {round.results.length}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {round.results.map((item) => (
              <div
                key={`${item.place}-${item.user.id}`}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>
                  {item.place}.
                </span>
                {item.user.firstName}
                {item.user.username ? ` (@${item.user.username})` : ''}
                <span style={{ opacity: 0.8, marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                  — {formatTime(item.tapTime)}
                </span>
              </div>
            ))}
          </div>
          <Link to="/reaction/rounds" className="btn" style={{ display: 'inline-block', marginTop: '1rem' }}>
            ← К списку раундов
          </Link>
        </>
      ) : null}
    </PageLayout>
  )
}

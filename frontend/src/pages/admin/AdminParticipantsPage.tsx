import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/api'

interface Participant {
  id: string
  firstName: string
  lastName: string | null
  username: string | null
  completionsCount: number
}

export function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiRequest<Participant[]>('/api/admin/participants')
      setParticipants(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  if (loading) return <p className="page__loading">Загрузка участников...</p>
  if (error) return <p className="page__error">Ошибка: {error}</p>

  return (
    <div className="admin-section">
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem' }}>Рейтинг участников (бинго)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {participants.length === 0 ? (
          <p style={{ opacity: 0.85 }}>Участников пока нет</p>
        ) : (
          participants.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.6rem 0.75rem',
                borderRadius: 8,
                background: 'color-mix(in srgb, currentColor 6%, transparent)',
                border: '1px solid color-mix(in srgb, currentColor 18%, transparent)',
              }}
            >
              <span>
                <strong>{i + 1}.</strong>{' '}
                {[p.firstName, p.lastName].filter(Boolean).join(' ')}
                {p.username ? ` (@${p.username})` : ''}
              </span>
              <span style={{ fontWeight: 600 }}>{p.completionsCount}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

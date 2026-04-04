import { useBehavior } from '../model'
import { AdminParticipantRow } from './AdminParticipantRow'

export function AdminParticipantsPage() {
  const { participants, loading, error } = useBehavior()

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
            <AdminParticipantRow
              key={p.id}
              rank={i + 1}
              displayName={`${[p.firstName, p.lastName].filter(Boolean).join(' ')}${p.username ? ` (@${p.username})` : ''}`}
              completionsCount={p.completionsCount}
            />
          ))
        )}
      </div>
    </div>
  )
}

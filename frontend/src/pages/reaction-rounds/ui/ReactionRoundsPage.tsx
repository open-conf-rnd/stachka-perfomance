import { PageLayout } from '@/shared/ui/PageLayout'
import { useBehavior } from '../model'
import { ReactionRoundListLink } from './ReactionRoundListLink'

export function ReactionRoundsPage() {
  const { rounds, loading, error } = useBehavior()

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
            <ReactionRoundListLink
              key={r.id}
              id={r.id}
              roundNumber={r.roundNumber}
              participantsCount={r.participantsCount}
              metaLine={`${formatDate(r.createdAt)} · ${r.status}`}
            />
          ))}
        </div>
      ) : null}
    </PageLayout>
  )
}

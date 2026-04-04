import { Link } from 'react-router-dom'
import { PageLayout } from '@/shared/ui/PageLayout'
import { useBehavior } from '../model'
import { ReactionRoundResultRow } from './ReactionRoundResultRow'

export function ReactionRoundDetailPage() {
  const { round, loading, error } = useBehavior()

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
              <ReactionRoundResultRow
                key={`${item.place}-${item.user.id}`}
                place={item.place}
                firstName={item.user.firstName}
                username={item.user.username}
                timeLabel={formatTime(item.tapTime)}
              />
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

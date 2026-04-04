import { Link } from 'react-router-dom'
import { PageLayout } from '@/components/PageLayout'
import { useBehavior } from '../model'
import { ReactionPlaceEntry } from './ReactionPlaceEntry'

export function ReactionPage() {
  const {
    roundNumber,
    status,
    countdown,
    podium,
    leaderboard,
    alreadyTapped,
    submitting,
    loading,
    error,
    canTap,
    onTap,
  } = useBehavior()

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
            <ReactionPlaceEntry
              key={`${item.place}-${item.user.id}`}
              place={item.place}
              firstName={item.user.firstName}
              username={item.user.username}
            />
          ))}
        </div>
      ) : null}

      {leaderboard.length > 0 ? (
        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Финальный рейтинг:</div>
          {leaderboard.map((item) => (
            <ReactionPlaceEntry
              key={`${item.place}-${item.user.id}`}
              place={item.place}
              firstName={item.user.firstName}
              username={item.user.username}
            />
          ))}
        </div>
      ) : null}
    </PageLayout>
  )
}

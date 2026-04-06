import { Link } from 'react-router-dom'
import { PageLayout } from '@/shared/ui/PageLayout'
import { useReactionPageBehavior } from '@/entities/reaction'
import { ReactionPlaceEntry } from '@/pages/reaction/ui/ReactionPlaceEntry'
import './ReactionResultsPage.css'

export function ReactionResultsPage() {
  const { roundNumber, status, podium, leaderboard, loading, error, alreadyTapped } =
    useReactionPageBehavior()

  const hasLists = podium.length > 0 || leaderboard.length > 0

  return (
    <PageLayout title="Реакция" subtitle="Сводка текущего раунда">
      <div className="reaction-results-page">
        <div className="reaction-results-page__actions">
          <Link to="/reaction" className="btn">
            К игре
          </Link>
          <Link to="/reaction/rounds" className="btn">
            Посмотреть все раунды
          </Link>
        </div>

        {loading ? <p className="page__loading">Загружаем состояние раунда...</p> : null}
        {error ? <p className="page__error">Ошибка: {error}</p> : null}

        {!loading ? (
          <p className="reaction-results-page__meta">
            {roundNumber != null ? `Раунд №${roundNumber}` : 'Раунда нет'} · {status}
          </p>
        ) : null}

        {alreadyTapped ? <p className="reaction-results-page__note">Твой результат зафиксирован.</p> : null}

        {podium.length > 0 ? (
          <div className="reaction-results-page__block">
            <div className="reaction-results-page__block-title">Первые три:</div>
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
          <div className="reaction-results-page__block">
            <div className="reaction-results-page__block-title">Финальный рейтинг:</div>
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

        {!loading && !error && !hasLists ? (
          <p className="reaction-results-page__empty">Пока нет списка — дождитесь старта или вернитесь к игре.</p>
        ) : null}
      </div>
    </PageLayout>
  )
}

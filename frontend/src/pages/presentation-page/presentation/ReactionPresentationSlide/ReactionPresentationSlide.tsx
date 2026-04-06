import { useReactionPageBehavior, type ReactionLeaderboardItem } from '@/entities/reaction'
import './ReactionPresentationSlide.css'

function formatDeltaFromFirst(leaderboard: ReactionLeaderboardItem[], index: number): string {
  if (index === 0) return 'лидер'
  const first = new Date(leaderboard[0].tapTime).getTime()
  const t = new Date(leaderboard[index].tapTime).getTime()
  const ms = Math.max(0, t - first)
  if (ms < 1000) return `+${ms} мс`
  const s = ms / 1000
  const rounded = s >= 10 ? s.toFixed(1) : s.toFixed(2)
  return `+${rounded.replace(/\.?0+$/, '')} с`
}

export function ReactionPresentationSlide() {
  const { roundNumber, status, countdown, podium, leaderboard, loading, error } = useReactionPageBehavior()

  const roundLabel = roundNumber != null ? `Раунд №${roundNumber}` : null

  return (
    <div className="reaction-pres-slide">
      <h2 className="reaction-pres-slide__title">Реакция</h2>

      {error ? <p className="reaction-pres-slide__error">{error}</p> : null}

      {loading ? <p className="reaction-pres-slide__status">Загрузка…</p> : null}

      {!loading && !error && status === 'IDLE' ? (
        <>
          {roundLabel ? <p className="reaction-pres-slide__meta">{roundLabel}</p> : null}
          <p className="reaction-pres-slide__hint">
            Ждём запуска раунда. Участникам: откройте «Реакцию» в приложении и будьте готовы нажать после старта.
          </p>
        </>
      ) : null}

      {!loading && !error && status === 'PENDING' ? (
        <>
          {roundLabel ? <p className="reaction-pres-slide__meta">{roundLabel}</p> : null}
          <p className="reaction-pres-slide__hint">Обратный отсчёт до старта</p>
          <div className="reaction-pres-slide__countdown-block" aria-live="polite">
            <div
              className={`reaction-pres-slide__countdown ${
                countdown === 0 ? 'reaction-pres-slide__countdown--go' : ''
              }`}
            >
              {countdown === null ? '…' : countdown > 0 ? countdown : 'Старт!'}
            </div>
            {countdown != null && countdown > 0 ? (
              <div className="reaction-pres-slide__countdown-unit">секунд</div>
            ) : null}
          </div>
        </>
      ) : null}

      {!loading && !error && status === 'ACTIVE' ? (
        <>
          {roundLabel ? <p className="reaction-pres-slide__meta">{roundLabel}</p> : null}
          <p className="reaction-pres-slide__active-title">Жмите!</p>
          <p className="reaction-pres-slide__hint">Кто быстрее нажмёт в мини-приложении — тот выше в рейтинге.</p>
          {podium.length > 0 ? (
            <div className="reaction-pres-slide__podium">
              <div className="reaction-pres-slide__podium-title">Сейчас в топ-3:</div>
              {podium.map((item) => (
                <div key={`${item.place}-${item.user.id}`} className="reaction-pres-slide__podium-row">
                  {item.place}. {item.user.firstName}
                  {item.user.username ? ` (@${item.user.username})` : ''}
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : null}

      {!loading && !error && status === 'FINISHED' ? (
        <>
          {roundLabel ? <p className="reaction-pres-slide__meta">{roundLabel}</p> : null}
          <div className="reaction-pres-slide__list-wrap">
            <div className="reaction-pres-slide__list-title">Все участники по скорости</div>
            {leaderboard.length === 0 ? (
              <p className="reaction-pres-slide__status" style={{ textAlign: 'center' }}>
                В этом раунде никто не нажал.
              </p>
            ) : (
              leaderboard.map((item, index) => (
                <div key={`${item.place}-${item.user.id}`} className="reaction-pres-slide__row">
                  <span className="reaction-pres-slide__place">{item.place}.</span>
                  <span className="reaction-pres-slide__name">
                    {item.user.firstName}
                    {item.user.username ? ` (@${item.user.username})` : ''}
                  </span>
                  <span className="reaction-pres-slide__delta">{formatDeltaFromFirst(leaderboard, index)}</span>
                </div>
              ))
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}

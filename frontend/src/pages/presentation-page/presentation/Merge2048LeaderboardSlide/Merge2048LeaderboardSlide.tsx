import { useEffect, useState } from 'react'
import { fetchMerge2048Leaderboard, type Merge2048LeaderboardItem } from '../participants'
import './Merge2048LeaderboardSlide.css'

const POLL_MS = 12_000

export function Merge2048LeaderboardSlide() {
  const [items, setItems] = useState<Merge2048LeaderboardItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = () => {
      void fetchMerge2048Leaderboard(10)
        .then((data) => {
          if (!cancelled) {
            setItems(data.items)
            setError(null)
            setLoading(false)
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Не удалось загрузить')
            setLoading(false)
          }
        })
    }

    load()
    const id = window.setInterval(load, POLL_MS)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  return (
    <div className="merge2048-pres-slide">
      <h2 className="merge2048-pres-slide__title">2048</h2>
      <p className="merge2048-pres-slide__subtitle">Топ‑10 по лучшей плитке</p>

      {error ? <p className="merge2048-pres-slide__error">{error}</p> : null}
      {loading && !error ? <p className="merge2048-pres-slide__status">Загрузка…</p> : null}

      {!loading && !error && items.length === 0 ? (
        <p className="merge2048-pres-slide__status">Пока никто не отправил результат — играйте в мини‑приложении.</p>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="merge2048-pres-slide__list-wrap">
          <div className="merge2048-pres-slide__head" aria-hidden>
            <span className="merge2048-pres-slide__h-place">#</span>
            <span className="merge2048-pres-slide__h-name">Участник</span>
            <span className="merge2048-pres-slide__h-tile">Макс</span>
            <span className="merge2048-pres-slide__h-score">Счёт</span>
            <span className="merge2048-pres-slide__h-games">Игр</span>
          </div>
          {items.map((row) => (
            <div key={row.userId} className="merge2048-pres-slide__row">
              <span className="merge2048-pres-slide__place">{row.place}</span>
              <span className="merge2048-pres-slide__name">
                {row.user.firstName}
                {row.user.username ? ` (@${row.user.username})` : ''}
              </span>
              <span className="merge2048-pres-slide__tile">{row.bestMaxTile}</span>
              <span className="merge2048-pres-slide__score">{row.bestScore.toLocaleString('ru-RU')}</span>
              <span className="merge2048-pres-slide__games">{row.gamesPlayed}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

import { PageLayout } from '@/shared/ui/PageLayout'
import { useMerge2048Page } from '../model/useMerge2048Page'
import './Merge2048Page.css'

function tileClass(v: number | null): string {
  if (v === null) return 'merge2048__cell merge2048__cell--empty'
  const capped = v >= 2048 ? 2048 : v
  return `merge2048__cell merge2048__cell--${capped}`
}

export function Merge2048Page() {
  const {
    grid,
    score,
    maxTile,
    gameOver,
    bingoMinTile,
    reset,
    onTouchStart,
    onTouchEnd,
  } = useMerge2048Page()

  return (
    <PageLayout title="2048" subtitle="Свайпни в сторону — сливаются одинаковые плитки">
      <div className="merge2048__meta">
        <div className="merge2048__score-box">
          <span className="merge2048__score-label">Счёт</span>
          <span className="merge2048__score-value">{score}</span>
        </div>
        <div className="merge2048__score-box">
          <span className="merge2048__score-label">Макс</span>
          <span className="merge2048__score-value">{maxTile}</span>
        </div>
      </div>
      <p className="merge2048__hint">
        Задание бинго: собери плитку {bingoMinTile}. На клавиатуре можно стрелками.
      </p>
      <div
        className="merge2048__board"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="application"
        aria-label="Поле 2048, свайпы влево вправо вверх вниз"
      >
        {grid.map((row, ri) => (
          <div key={ri} className="merge2048__row">
            {row.map((cell, ci) => (
              <div key={ci} className={tileClass(cell)}>
                {cell !== null ? cell : ''}
              </div>
            ))}
          </div>
        ))}
        {gameOver ? (
          <div className="merge2048__overlay" role="status">
            <p className="merge2048__overlay-title">Нет ходов</p>
            <button type="button" className="btn merge2048__again" onClick={reset}>
              Ещё раз
            </button>
          </div>
        ) : null}
      </div>
      <div className="merge2048__actions">
        <button type="button" className="btn" onClick={reset}>
          Новая игра
        </button>
      </div>
    </PageLayout>
  )
}

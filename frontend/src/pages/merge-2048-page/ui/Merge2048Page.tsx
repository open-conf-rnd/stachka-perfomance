import { useTelegramBackButton } from '@/shared/ui/PageLayout/useTelegramBackButton'
import { useMerge2048Page } from '../model/useMerge2048Page'
import './Merge2048Page.css'

function tileClass(v: number | null): string {
  if (v === null) return 'merge2048__cell merge2048__cell--empty'
  const capped = v >= 2048 ? 2048 : v
  return `merge2048__cell merge2048__cell--${capped}`
}

export function Merge2048Page() {
  useTelegramBackButton(true)

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
    <main className="merge2048-shell">
      <div className="merge2048">
        <header className="merge2048__header">
          <div className="merge2048__header-row">
            <h1 className="merge2048__title">2048</h1>
            <button type="button" className="btn merge2048__btn-sm" onClick={reset}>
              {gameOver ? 'Ещё раз' : 'Новая игра'}
            </button>
          </div>
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
        </header>
        <div className="merge2048__stage">
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
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}

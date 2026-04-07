import { useEffect } from 'react'
import { useTelegramBackButton } from '@/shared/ui/PageLayout/useTelegramBackButton'
import { useMerge2048Page } from '../model/useMerge2048Page'
import './Merge2048Page.css'

function tileClass(
  v: number | null,
  ri: number,
  ci: number,
  spawnCells: Array<{ r: number; c: number }>,
  mergeCells: Array<{ r: number; c: number }>
): string {
  if (v === null) return 'merge2048__cell merge2048__cell--empty'
  const capped = v >= 2048 ? 2048 : v
  const isSpawn = spawnCells.some((s) => s.r === ri && s.c === ci)
  const isMerge = mergeCells.some((m) => m.r === ri && m.c === ci)
  let cls = `merge2048__cell merge2048__cell--${capped}`
  if (isSpawn) cls += ' merge2048__cell--spawn'
  if (isMerge) cls += ' merge2048__cell--merge'
  return cls
}

export function Merge2048Page() {
  useTelegramBackButton(true)

  useEffect(() => {
    const wa = window.Telegram?.WebApp
    if (!wa?.disableVerticalSwipes) return
    wa.disableVerticalSwipes()
    return () => {
      wa.enableVerticalSwipes?.()
    }
  }, [])

  const {
    grid,
    score,
    maxTile,
    gameOver,
    bingoMinTile,
    spawnCells,
    mergeCells,
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
                  <div key={ci} className={tileClass(cell, ri, ci, spawnCells, mergeCells)}>
                    {cell !== null ? <span className="merge2048__cell-face">{cell}</span> : null}
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

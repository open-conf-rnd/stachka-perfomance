import { useCallback, useEffect, useReducer, useRef } from 'react'
import { apiRequestWithNotifications } from '@/shared/lib/api'
import {
  addRandomTile,
  canMove,
  createStartingGrid,
  gridMaxTile,
  moveGrid,
  type Direction,
  type Grid,
} from './merge2048Game'

const BINGO_MIN_TILE = 512

interface GameState {
  grid: Grid
  score: number
  gameOver: boolean
}

type GameAction =
  | { type: 'move'; dir: Direction }
  | { type: 'reset' }

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'reset') {
    return {
      grid: createStartingGrid(),
      score: 0,
      gameOver: false,
    }
  }
  const { grid: next, changed, scoreDelta } = moveGrid(state.grid, action.dir)
  if (!changed) return state
  const withTile = addRandomTile(next)
  return {
    grid: withTile,
    score: state.score + scoreDelta,
    gameOver: !canMove(withTile),
  }
}

export function useMerge2048Page() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => ({
    grid: createStartingGrid(),
    score: 0,
    gameOver: false,
  }))
  const bingoAttemptedRef = useRef(false)

  const maxTile = gridMaxTile(state.grid)

  const tryReportBingo = useCallback(async (tile: number) => {
    if (bingoAttemptedRef.current || tile < BINGO_MIN_TILE) return
    bingoAttemptedRef.current = true
    try {
      await apiRequestWithNotifications<{ success: boolean; alreadyCompleted?: boolean }>(
        '/api/merge2048/milestone',
        'POST',
        { maxTile: tile },
        {
          popupTitle: 'Бинго',
          successMessage: 'Задание «2048» отмечено',
          errorMessage: 'Не удалось отметить задание бинго',
          successCondition: (r: unknown) =>
            typeof r === 'object' &&
            r !== null &&
            'success' in r &&
            (r as { success: boolean }).success === true,
        }
      )
    } catch {
      bingoAttemptedRef.current = false
    }
  }, [])

  useEffect(() => {
    void tryReportBingo(maxTile)
  }, [maxTile, tryReportBingo])

  const applyMove = useCallback((dir: Direction) => {
    dispatch({ type: 'move', dir })
  }, [])

  const reset = useCallback(() => {
    bingoAttemptedRef.current = false
    dispatch({ type: 'reset' })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        applyMove('left')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        applyMove('right')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        applyMove('up')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        applyMove('down')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [applyMove])

  const touchRef = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current
    touchRef.current = null
    if (!start || e.changedTouches.length === 0) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    const min = 40
    if (absX < min && absY < min) return
    if (absX >= absY) {
      applyMove(dx > 0 ? 'right' : 'left')
    } else {
      applyMove(dy > 0 ? 'down' : 'up')
    }
  }

  return {
    grid: state.grid,
    score: state.score,
    maxTile,
    gameOver: state.gameOver,
    bingoMinTile: BINGO_MIN_TILE,
    reset,
    onTouchStart,
    onTouchEnd,
  }
}

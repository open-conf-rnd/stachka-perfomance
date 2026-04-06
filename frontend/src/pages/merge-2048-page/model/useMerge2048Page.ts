import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { apiRequestWithNotifications } from '@/shared/lib/api'
import { postMerge2048Session } from './postMerge2048Session'
import {
  addRandomTile,
  canMove,
  createStartingGrid,
  gridMaxTile,
  moveGrid,
  type Direction,
  type Grid,
} from './merge2048Game'
import {
  clearMerge2048PersistedState,
  loadMerge2048PersistedState,
  saveMerge2048PersistedState,
} from './merge2048Persistence'

const BINGO_MIN_TILE = 512

interface GameState {
  grid: Grid
  score: number
  gameOver: boolean
  moveCount: number
  spawnCells: Array<{ r: number; c: number }>
}

type GameAction =
  | { type: 'move'; dir: Direction }
  | { type: 'reset' }
  | { type: 'clearSpawn' }

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'clearSpawn') {
    if (state.spawnCells.length === 0) return state
    return { ...state, spawnCells: [] }
  }
  if (action.type === 'reset') {
    const { grid, spawnCells } = createStartingGrid()
    return {
      grid,
      score: 0,
      gameOver: false,
      moveCount: 0,
      spawnCells,
    }
  }
  const { grid: next, changed, scoreDelta } = moveGrid(state.grid, action.dir)
  if (!changed) return state
  const { grid: withTile, spawnedAt } = addRandomTile(next)
  return {
    grid: withTile,
    score: state.score + scoreDelta,
    gameOver: !canMove(withTile),
    moveCount: state.moveCount + 1,
    spawnCells: spawnedAt ? [spawnedAt] : [],
  }
}

function findMergedCells(prev: Grid, next: Grid): Array<{ r: number; c: number }> {
  const out: Array<{ r: number; c: number }> = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const a = prev[r][c]
      const b = next[r][c]
      if (a !== null && b !== null && b === a * 2) {
        out.push({ r, c })
      }
    }
  }
  return out
}

export function useMerge2048Page() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    const restored = loadMerge2048PersistedState()
    if (restored) return { ...restored, spawnCells: [] }
    const { grid, spawnCells } = createStartingGrid()
    return { grid, score: 0, gameOver: false, moveCount: 0, spawnCells }
  })
  const stateRef = useRef(state)
  stateRef.current = state
  const bingoAttemptedRef = useRef(false)
  const gameOverSessionPostedRef = useRef(false)

  const [mergeCells, setMergeCells] = useState<Array<{ r: number; c: number }>>([])
  const prevGridRef = useRef(state.grid)
  const skipMergeAfterResetRef = useRef(false)

  useLayoutEffect(() => {
    const next = state.grid
    if (skipMergeAfterResetRef.current) {
      skipMergeAfterResetRef.current = false
      prevGridRef.current = next
      return
    }
    const prev = prevGridRef.current
    prevGridRef.current = next
    const merges = findMergedCells(prev, next)
    if (merges.length > 0) setMergeCells(merges)
  }, [state.grid])

  useEffect(() => {
    if (mergeCells.length === 0) return
    const t = window.setTimeout(() => setMergeCells([]), 280)
    return () => window.clearTimeout(t)
  }, [mergeCells])

  useEffect(() => {
    if (state.spawnCells.length === 0) return
    const t = window.setTimeout(() => {
      dispatch({ type: 'clearSpawn' })
    }, 340)
    return () => window.clearTimeout(t)
  }, [state.spawnCells])

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

  useEffect(() => {
    saveMerge2048PersistedState({
      grid: state.grid,
      score: state.score,
      gameOver: state.gameOver,
      moveCount: state.moveCount,
    })
  }, [state.grid, state.score, state.gameOver, state.moveCount])

  useEffect(() => {
    if (!state.gameOver) {
      gameOverSessionPostedRef.current = false
      return
    }
    if (gameOverSessionPostedRef.current) return
    gameOverSessionPostedRef.current = true
    void postMerge2048Session(gridMaxTile(state.grid), state.score)
  }, [state.gameOver, state.grid, state.score])

  const applyMove = useCallback((dir: Direction) => {
    dispatch({ type: 'move', dir })
  }, [])

  const reset = useCallback(() => {
    const s = stateRef.current
    if (!s.gameOver && s.moveCount > 0) {
      void postMerge2048Session(gridMaxTile(s.grid), s.score)
    }
    bingoAttemptedRef.current = false
    clearMerge2048PersistedState()
    skipMergeAfterResetRef.current = true
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
    spawnCells: state.spawnCells,
    mergeCells,
    reset,
    onTouchStart,
    onTouchEnd,
  }
}

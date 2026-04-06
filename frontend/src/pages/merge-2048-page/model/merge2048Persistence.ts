import { canMove, createStartingGrid, type Grid } from './merge2048Game'

const STORAGE_KEY = 'stachka-merge2048-v1'
const VERSION = 2

export interface Merge2048PersistedPayload {
  v: number
  grid: Grid
  score: number
  moveCount?: number
}

export interface Merge2048GameStateSnapshot {
  grid: Grid
  score: number
  gameOver: boolean
  moveCount: number
}

function isValidGrid(g: unknown): g is Grid {
  if (!Array.isArray(g) || g.length !== 4) return false
  for (const row of g) {
    if (!Array.isArray(row) || row.length !== 4) return false
    for (const c of row) {
      if (c !== null && (typeof c !== 'number' || !Number.isInteger(c) || c <= 0)) return false
    }
  }
  return true
}

export function loadMerge2048PersistedState(): Merge2048GameStateSnapshot | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Merge2048PersistedPayload
    if ((data.v !== VERSION && data.v !== 1) || !isValidGrid(data.grid)) return null
    const score = typeof data.score === 'number' && data.score >= 0 ? data.score : 0
    if (!canMove(data.grid)) return null
    const moveCount =
      data.v >= 2 && typeof data.moveCount === 'number' && data.moveCount >= 0 ? data.moveCount : 0
    return { grid: data.grid, score, gameOver: false, moveCount }
  } catch {
    return null
  }
}

export function saveMerge2048PersistedState(state: Merge2048GameStateSnapshot): void {
  if (typeof window === 'undefined') return
  try {
    if (state.gameOver) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }
    const payload: Merge2048PersistedPayload = {
      v: VERSION,
      grid: state.grid,
      score: state.score,
      moveCount: state.moveCount,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // квота / приватный режим — играем без сохранения
  }
}

export function clearMerge2048PersistedState(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function createInitialMerge2048State(): Merge2048GameStateSnapshot {
  const { grid } = createStartingGrid()
  return {
    grid,
    score: 0,
    gameOver: false,
    moveCount: 0,
  }
}

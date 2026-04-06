export type Direction = 'up' | 'down' | 'left' | 'right'

export type Cell = number | null

export type Grid = Cell[][]

const SIZE = 4

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array<Cell>(SIZE).fill(null))
}

function transpose(grid: Grid): Grid {
  const out = emptyGrid()
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      out[c][r] = grid[r][c]
    }
  }
  return out
}

function flipHorizontal(grid: Grid): Grid {
  return grid.map((row) => [...row].reverse())
}

function slideRowLeft(row: Cell[]): { row: Cell[]; scoreDelta: number } {
  const tiles = row.filter((c): c is number => c !== null)
  const next: number[] = []
  let scoreDelta = 0
  let i = 0
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      const v = tiles[i] * 2
      next.push(v)
      scoreDelta += v
      i += 2
    } else {
      next.push(tiles[i])
      i += 1
    }
  }
  const result: Cell[] = [...next]
  while (result.length < SIZE) result.push(null)
  return { row: result, scoreDelta }
}

function rowsEqual(a: Grid, b: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false
    }
  }
  return true
}

function slideAllLeft(grid: Grid): { grid: Grid; scoreDelta: number } {
  let scoreDelta = 0
  const slid: Grid = []
  for (let r = 0; r < SIZE; r++) {
    const { row, scoreDelta: d } = slideRowLeft(grid[r])
    scoreDelta += d
    slid.push(row)
  }
  return { grid: slid, scoreDelta }
}

/** Приводим поле к виду «слияние влево», сдвигаем, возвращаем в исходную ориентацию. */
export function moveGrid(grid: Grid, dir: Direction): { grid: Grid; changed: boolean; scoreDelta: number } {
  let work = grid.map((row) => [...row])
  if (dir === 'up') work = transpose(work)
  else if (dir === 'down') {
    work = transpose(work)
    work = flipHorizontal(work)
  } else if (dir === 'right') {
    work = flipHorizontal(work)
  }

  const { grid: slid, scoreDelta } = slideAllLeft(work)

  let next = slid
  if (dir === 'up') next = transpose(next)
  else if (dir === 'down') {
    next = flipHorizontal(next)
    next = transpose(next)
  } else if (dir === 'right') {
    next = flipHorizontal(next)
  }

  return { grid: next, changed: !rowsEqual(grid, next), scoreDelta }
}

export function gridMaxTile(grid: Grid): number {
  let m = 0
  for (const row of grid) {
    for (const cell of row) {
      if (cell !== null && cell > m) m = cell
    }
  }
  return m
}

export function addRandomTile(grid: Grid): Grid {
  const empties: Array<{ r: number; c: number }> = []
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === null) empties.push({ r, c })
    }
  }
  if (empties.length === 0) return grid
  const { r, c } = empties[Math.floor(Math.random() * empties.length)]
  const copy = grid.map((row) => [...row])
  copy[r][c] = Math.random() < 0.9 ? 2 : 4
  return copy
}

export function createStartingGrid(): Grid {
  let g = emptyGrid()
  g = addRandomTile(g)
  g = addRandomTile(g)
  return g
}

export function canMove(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === null) return true
      const v = grid[r][c]
      if (c + 1 < SIZE && grid[r][c + 1] === v) return true
      if (r + 1 < SIZE && grid[r + 1][c] === v) return true
    }
  }
  return false
}

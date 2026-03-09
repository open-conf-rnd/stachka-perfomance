const isViteDev =
  typeof location !== 'undefined' && location.hostname === 'localhost' && location.port === '5173'

/** Базовый URL для API. Vite dev → localhost:3000; иначе — тот же хост (пустая строка = /api/) */
export const apiBase = isViteDev ? 'http://localhost:3000' : ''

/** URL WebSocket. Vite dev → localhost:3001; иначе — тот же хост, путь /ws */
export const wsUrl = isViteDev
  ? 'ws://localhost:3001'
  : `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws`

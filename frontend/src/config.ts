const isViteDev = typeof location !== 'undefined' && location.hostname === 'localhost' && location.port === '5173'
const appUrl = (import.meta.env.VITE_APP_URL as string | undefined)?.replace(/\/$/, '')

function toWsUrl(baseUrl: string): string {
  try {
    const url = new URL(baseUrl)
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${url.host}/ws`
  } catch {
    return ''
  }
}

/** Базовый URL для API (пустая строка = тот же хост, прокси /api/) */
export const apiBase =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  (isViteDev ? 'http://localhost:3000' : appUrl || '')

/**
 * URL WebSocket статистики.
 * В браузере на localhost:5173 (Vite) — прямо на ws-сервер :3001.
 * За nginx (https) — wss с явным портом 443, чтобы не уходить на 80.
 */
export const wsUrl =
  (import.meta.env.VITE_STATS_WS_URL as string | undefined) ||
  (isViteDev
    ? 'ws://localhost:3001'
    : appUrl
      ? toWsUrl(appUrl)
      : location.protocol === 'https:'
        ? `wss://${location.hostname}:443/ws`
        : `ws://${location.hostname}${location.port ? ':' + location.port : ''}/ws`)

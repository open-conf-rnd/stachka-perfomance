/**
 * В dev на :5173 API живёт на :3000 того же hostname (localhost, 127.0.0.1, LAN IP).
 * Раньше учитывали только localhost — при 127.0.0.1 или IP запросы шли на /api у Vite → 404.
 */
function resolveApiBase(): string {
  if (typeof location === 'undefined') return ''
  const fromEnv = import.meta.env.VITE_API_BASE?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (import.meta.env.DEV && location.port === '5173') {
    return `${location.protocol}//${location.hostname}:3000`
  }
  return ''
}

function resolveWsUrl(): string {
  if (typeof location === 'undefined') return 'ws://localhost:3001'
  const fromEnv = import.meta.env.VITE_WS_URL?.trim()
  if (fromEnv) return fromEnv
  if (import.meta.env.DEV && location.port === '5173') {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws'
    return `${proto}://${location.hostname}:3001`
  }
  return `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws`
}

/** Базовый URL для API. Vite dev → :3000 на том же хосте; прод — пусто (относительные /api/...) */
export const apiBase = resolveApiBase()

/** URL WebSocket: в dev — :3001 на том же хосте; прод — /ws на текущем origin */
export const wsUrl = resolveWsUrl()

/** Имя бота для ссылок t.me (привязка аккаунта из VK). Локально — test-бот, прод — без VITE_ — основной. */
export const TG_BOT_USERNAME =
  import.meta.env.VITE_TG_BOT_USERNAME?.trim() ||
  (import.meta.env.DEV ? 'test_stachka_grosh_bot' : 'stachkagrosh_bot')

/** Префикс startapp для завершения привязки: `al` + 32 hex токена */
export const ACCOUNT_LINK_STARTAPP_PREFIX = 'al'

/** Страница мини-приложения VK (ссылка после привязки в Telegram) */
export const VK_MINI_APP_URL = import.meta.env.VITE_VK_MINI_APP_URL ?? 'https://vk.com/app54525265'

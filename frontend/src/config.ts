const isViteDev =
  typeof location !== 'undefined' && location.hostname === 'localhost' && location.port === '5173'

/** Базовый URL для API. Vite dev → localhost:3000; иначе — тот же хост (пустая строка = /api/) */
export const apiBase = isViteDev ? 'http://localhost:3000' : ''

/** URL WebSocket. Vite dev → localhost:3001; иначе — тот же хост, путь /ws */
export const wsUrl = isViteDev
  ? 'ws://localhost:3001'
  : `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws`

/** Имя бота для ссылок t.me (привязка аккаунта из VK). Локально — test-бот, прод — без VITE_ — основной. */
export const TG_BOT_USERNAME =
  import.meta.env.VITE_TG_BOT_USERNAME?.trim() ||
  (import.meta.env.DEV ? 'test_stachka_grosh_bot' : 'stachkagrosh_bot')

/** Префикс startapp для завершения привязки: `al` + 32 hex токена */
export const ACCOUNT_LINK_STARTAPP_PREFIX = 'al'

/** Страница мини-приложения VK (ссылка после привязки в Telegram) */
export const VK_MINI_APP_URL = import.meta.env.VITE_VK_MINI_APP_URL ?? 'https://vk.com/app54525265'

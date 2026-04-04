const VK_LAUNCH_STORAGE_KEY = 'stachka_vk_launch'

/** Подписанные launch params VK: в query или в hash, набор ключей может отличаться по клиенту. */
function looksLikeVkLaunchParams(q: string): boolean {
  if (!q) return false
  return /(^|[&?])vk_/.test(q) || /(^|[&?])sign=/.test(q)
}

function readVkQueryFromLocation(): string {
  if (typeof window === 'undefined') return ''
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash
  const search = window.location.search.startsWith('?')
    ? window.location.search.slice(1)
    : window.location.search
  if (looksLikeVkLaunchParams(hash)) return hash
  if (looksLikeVkLaunchParams(search)) return search
  return ''
}

/** Сохранить подписанные параметры из URL (hash или query), чтобы не потерять после навигации. */
export function captureVkLaunchParamsFromUrl(): void {
  const q = readVkQueryFromLocation()
  if (q) {
    sessionStorage.setItem(VK_LAUNCH_STORAGE_KEY, q)
  }
}

export function getVkLaunchParamsForHeaders(): string {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem(VK_LAUNCH_STORAGE_KEY) ?? readVkQueryFromLocation()
}

export type AppPlatform = 'telegram' | 'vk' | 'standalone'

export function getAppPlatform(): AppPlatform {
  if (typeof window === 'undefined') return 'standalone'
  // Сначала VK: при mockTelegramEnv для WebView есть фейковый initData, но авторизация — по launch params.
  if (getVkLaunchParamsForHeaders()) return 'vk'
  if (window.Telegram?.WebApp?.initData) return 'telegram'
  return 'standalone'
}

/** Заголовки для авторизации в API (Telegram или VK, не оба). */
export function getApiAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const vk = getVkLaunchParamsForHeaders()
  if (vk) {
    return { 'x-vk-launch-params': vk }
  }
  const tg = window.Telegram?.WebApp?.initData ?? ''
  if (tg) {
    return { 'x-telegram-init-data': tg }
  }
  return {}
}

/** Токен привязки VK→Telegram между редиректом и страницей /account-link */
export const PENDING_VK_LINK_TOKEN_KEY = 'stachka_pending_vk_link_token'

/** После успешной привязки в Telegram — тот же startParam не ведёт снова на /account-link */
export const COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY = 'stachka_tg_account_link_done_sp'

function normalizeAccountLinkToken(raw: string | null | undefined): string | null {
  if (!raw) return null
  const t = raw.trim()
  if (!/^[a-f0-9]{32}$/i.test(t)) return null
  return t.toLowerCase()
}

/**
 * Токен из ?account_link= или из hash (VK: vk.com/app…#account_link=…; старый вид #/register?… тоже разбираем).
 */
export function peekAccountLinkTokenFromLocation(): string | null {
  if (typeof window === 'undefined') return null

  const fromSearch = normalizeAccountLinkToken(
    new URLSearchParams(window.location.search).get('account_link')
  )
  if (fromSearch) return fromSearch

  const rawHash = window.location.hash
  if (!rawHash || rawHash.length < 2) return null
  const hash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash
  const queryPart = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : hash
  const fromHashParams = normalizeAccountLinkToken(
    new URLSearchParams(queryPart).get('account_link')
  )
  if (fromHashParams) return fromHashParams

  const m = /(?:^|[?&])account_link=([a-f0-9]{32})/i.exec(hash)
  return normalizeAccountLinkToken(m?.[1] ?? null)
}

/** Убрать hash с account_link после переноса в React Router (параметры VK уже в sessionStorage). */
export function stripAccountLinkHashFromLocation(): void {
  if (typeof window === 'undefined') return
  if (!window.location.hash) return
  if (!/account_link=/i.test(window.location.hash)) return
  const { pathname, search } = window.location
  window.history.replaceState(null, '', pathname + search)
}

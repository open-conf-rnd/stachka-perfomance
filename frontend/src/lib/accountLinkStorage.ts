/** Токен привязки VK→Telegram между редиректом и страницей /account-link */
export const PENDING_VK_LINK_TOKEN_KEY = 'stachka_pending_vk_link_token'

/** После успешной привязки в Telegram — тот же startParam не ведёт снова на /account-link */
export const COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY = 'stachka_tg_account_link_done_sp'

/** После успешной привязки TG→VK в мини-приложении VK — тот же account_link не триггерит повторный complete */
export const COMPLETED_VK_TG_ACCOUNT_LINK_TOKEN_KEY = 'stachka_vk_tg_account_link_done_token'

function normalizeAccountLinkToken(raw: string | null | undefined): string | null {
  if (!raw) return null
  const t = raw.trim()
  if (!/^[a-f0-9]{32}$/i.test(t)) return null
  return t.toLowerCase()
}

/** Разбор account_link из тела hash/фрагмента (без ведущего #). */
function accountLinkTokenFromHashBody(hashBody: string): string | null {
  if (!hashBody) return null
  const queryPart = hashBody.includes('?') ? hashBody.slice(hashBody.indexOf('?') + 1) : hashBody
  const fromHashParams = normalizeAccountLinkToken(
    new URLSearchParams(queryPart).get('account_link')
  )
  if (fromHashParams) return fromHashParams
  const m = /(?:^|[?&])account_link=([a-f0-9]{32})/i.exec(hashBody)
  return normalizeAccountLinkToken(m?.[1] ?? null)
}

/**
 * Токен из поля `location` событий VK Bridge (VKWebAppLocationChanged / VKWebAppChangeFragment)
 * или из произвольной строки с URL / фрагментом.
 */
export function peekAccountLinkTokenFromVkBridgeLocation(
  locationPayload: string | null | undefined
): string | null {
  if (!locationPayload?.trim()) return null
  const s = locationPayload.trim()

  const fromQuery = (q: string) =>
    normalizeAccountLinkToken(new URLSearchParams(q).get('account_link'))

  try {
    if (/^https?:\/\//i.test(s)) {
      const u = new URL(s)
      const fromSearch = normalizeAccountLinkToken(u.searchParams.get('account_link'))
      if (fromSearch) return fromSearch
      const h = u.hash.startsWith('#') ? u.hash.slice(1) : u.hash
      const fromHash = accountLinkTokenFromHashBody(h)
      if (fromHash) return fromHash
    }
  } catch {
    // не URL — пробуем как фрагмент
  }

  const noHash = s.startsWith('#') ? s.slice(1) : s
  const direct = fromQuery(noHash)
  if (direct) return direct
  return accountLinkTokenFromHashBody(noHash)
}

/** Токен из `window.location.hash` (без учёта search). */
function peekAccountLinkTokenFromWindowHash(): string | null {
  if (typeof window === 'undefined') return null
  const rawHash = window.location.hash
  if (!rawHash || rawHash.length < 2) return null
  const hash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash
  return accountLinkTokenFromHashBody(hash)
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

  return peekAccountLinkTokenFromWindowHash()
}

/** Убрать hash с account_link после переноса в React Router (параметры VK уже в sessionStorage). */
export function stripAccountLinkHashFromLocation(): void {
  if (typeof window === 'undefined') return
  if (!window.location.hash) return
  if (!/account_link=/i.test(window.location.hash)) return
  const { pathname, search } = window.location
  window.history.replaceState(null, '', pathname + search)
}

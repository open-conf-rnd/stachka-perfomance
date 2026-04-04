import { ACCOUNT_LINK_STARTAPP_PREFIX } from '../config'
import { getVkLaunchParamsForHeaders } from './authHeaders'

/** Значение vk_ref / ?ref=… с внешней ссылки на мини-приложение (как startapp в Telegram). */
export function parseAccountLinkTokenFromVkRef(vkRef: string | null | undefined): string | null {
  if (!vkRef || typeof vkRef !== 'string') return null
  const trimmed = vkRef.trim()
  const p = ACCOUNT_LINK_STARTAPP_PREFIX
  if (!trimmed.startsWith(p) || trimmed.length !== p.length + 32) return null
  const hex = trimmed.slice(p.length).toLowerCase()
  return /^[a-f0-9]{32}$/.test(hex) ? hex : null
}

function tokenFromSearchParams(params: URLSearchParams): string | null {
  return (
    parseAccountLinkTokenFromVkRef(params.get('vk_ref')) ??
    parseAccountLinkTokenFromVkRef(params.get('ref'))
  )
}

/**
 * vk_ref / ref: из адреса iframe и из sessionStorage (после captureVkLaunchParamsFromUrl).
 */
export function peekAccountLinkTokenFromVkLaunchParams(): string | null {
  if (typeof window !== 'undefined') {
    const h = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash
    const s = window.location.search.startsWith('?')
      ? window.location.search.slice(1)
      : window.location.search
    const merged = [s, h].filter(Boolean).join('&')
    if (merged) {
      const fromLoc = tokenFromSearchParams(new URLSearchParams(merged))
      if (fromLoc) return fromLoc
    }
  }

  const q = getVkLaunchParamsForHeaders()
  if (!q) return null
  const normalized = q.startsWith('#') ? q.slice(1) : q
  const params = new URLSearchParams(
    normalized.startsWith('?') ? normalized.slice(1) : normalized
  )
  return tokenFromSearchParams(params)
}

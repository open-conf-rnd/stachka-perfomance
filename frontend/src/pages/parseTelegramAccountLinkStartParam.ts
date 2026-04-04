import { ACCOUNT_LINK_STARTAPP_PREFIX } from '@/config'

/** Токен из Telegram start_param / startapp (префикс `al` + 32 hex). */
export function parseTelegramAccountLinkStartParam(startParam: string | undefined): string | null {
  if (!startParam) return null
  const prefix = ACCOUNT_LINK_STARTAPP_PREFIX
  if (!startParam.startsWith(prefix) || startParam.length !== prefix.length + 32) return null
  const hex = startParam.slice(prefix.length).toLowerCase()
  return /^[a-f0-9]{32}$/.test(hex) ? hex : null
}

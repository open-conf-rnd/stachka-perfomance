import type { IncomingHttpHeaders } from 'node:http'
import { validateInitData } from './telegram.js'
import { verifyAndParseVkLaunch } from './vk-launch.js'

const TG_ADMIN_USER_IDS = new Set(
  (process.env.TG_ADMIN_USER_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
)

const VK_ADMIN_USER_IDS = new Set(
  (process.env.VK_ADMIN_USER_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
)

function headerStr(value: string | string[] | undefined): string | null {
  if (typeof value === 'string' && value.length > 0) return value
  if (Array.isArray(value) && value[0]) return value[0]
  return null
}

/** @param telegramExternalId — Telegram user id string (same as initData user.id) */
export function isAdminTelegramUser(telegramExternalId: string): boolean {
  if (TG_ADMIN_USER_IDS.size === 0) return true
  return TG_ADMIN_USER_IDS.has(telegramExternalId)
}

export function isAdminVkUser(vkExternalUserId: string): boolean {
  if (VK_ADMIN_USER_IDS.size === 0) return true
  return VK_ADMIN_USER_IDS.has(vkExternalUserId)
}

/** Заголовок Telegram имеет приоритет, если заданы оба. */
export function requireAdmin(headers: IncomingHttpHeaders): {
  ok: true
  userId: string
} | { ok: false; status: number; body: { error: string } } {
  const initData = headerStr(headers['x-telegram-init-data'])
  if (initData) {
    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return { ok: false, status: 401, body: { error: 'Invalid init data' } }
    }
    const telegramExternalId = String(tgUser.id)
    if (!isAdminTelegramUser(telegramExternalId)) {
      return { ok: false, status: 403, body: { error: 'Admin access required' } }
    }
    return { ok: true, userId: telegramExternalId }
  }

  const vkRaw = headerStr(headers['x-vk-launch-params'])
  if (vkRaw) {
    const secret = process.env.VK_APP_SECRET ?? ''
    const appId = process.env.VK_APP_ID?.trim() || undefined
    const parsed = verifyAndParseVkLaunch(vkRaw, secret, appId)
    if (!parsed) {
      return { ok: false, status: 401, body: { error: 'Invalid init data' } }
    }
    if (!isAdminVkUser(parsed.vkUserId)) {
      return { ok: false, status: 403, body: { error: 'Admin access required' } }
    }
    return { ok: true, userId: parsed.vkUserId }
  }

  return { ok: false, status: 401, body: { error: 'Missing init data' } }
}

import { validateInitData } from './telegram.js'

const ADMIN_USER_IDS = new Set(
  (process.env.ADMIN_USER_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
)

export function isAdminUser(userId: string): boolean {
  if (ADMIN_USER_IDS.size === 0) return true
  return ADMIN_USER_IDS.has(userId)
}

export function requireAdmin(
  initDataHeader: unknown
): { ok: true; userId: string } | { ok: false; status: number; body: { error: string } } {
  const initData = typeof initDataHeader === 'string' && initDataHeader.length > 0 ? initDataHeader : null
  if (!initData) {
    return { ok: false, status: 401, body: { error: 'Missing init data' } }
  }

  const tgUser = validateInitData(initData)
  if (!tgUser) {
    return { ok: false, status: 401, body: { error: 'Invalid init data' } }
  }

  const userId = String(tgUser.id)
  if (!isAdminUser(userId)) {
    return { ok: false, status: 403, body: { error: 'Admin access required' } }
  }

  return { ok: true, userId }
}

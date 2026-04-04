import crypto from 'node:crypto'

/** HMAC-SHA256(secret, queryString) → base64url, как в доке VK / пакете vk-launch-params */
function vkSign(secretKey: string, queryString: string): string {
  return crypto.createHmac('sha256', secretKey).update(queryString).digest('base64url')
}

/**
 * Проверка строки параметров запуска (query без ведущего `?`, включает sign).
 * @see https://dev.vk.com/ru/mini-apps/development/protect-with-signature
 */
export function verifyVkLaunchParams(rawQuery: string, secretKey: string): boolean {
  if (!secretKey || !rawQuery.trim()) return false
  const normalized = rawQuery.trim().replace(/^\?/, '')
  const urlParams = new URLSearchParams(normalized)
  const sign = urlParams.get('sign')
  if (!sign || urlParams.size === 0) return false

  urlParams.delete('sign')
  const queryString = [...urlParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  return vkSign(secretKey, queryString) === sign
}

export interface VkLaunchParsed {
  vkUserId: string
  vkAppId: string
  rawQuery: string
}

export function parseVkLaunchParams(rawQuery: string): VkLaunchParsed | null {
  const normalized = rawQuery.trim().replace(/^\?/, '')
  const urlParams = new URLSearchParams(normalized)
  const vkUserId = urlParams.get('vk_user_id')
  const vkAppId = urlParams.get('vk_app_id')
  if (!vkUserId || !vkAppId) return null
  return { vkUserId, vkAppId, rawQuery: normalized }
}

export function verifyAndParseVkLaunch(
  rawQuery: string,
  secretKey: string,
  expectedAppId?: string
): VkLaunchParsed | null {
  if (!verifyVkLaunchParams(rawQuery, secretKey)) return null
  const parsed = parseVkLaunchParams(rawQuery)
  if (!parsed) return null
  if (expectedAppId && parsed.vkAppId !== expectedAppId) return null
  return parsed
}

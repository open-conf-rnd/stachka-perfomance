import crypto from 'node:crypto'

const BOT_TOKEN = process.env.TG_BOT_API ?? ''

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

export function validateInitData(initData: string): TelegramUser | null {
  if (!BOT_TOKEN || !initData) return null

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null

  params.delete('hash')
  const entries = [...params.entries()].sort(([a], [b]) => a.localeCompare(b))
  const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join('\n')

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest()

  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  if (computedHash !== hash) return null

  const userRaw = params.get('user')
  if (!userRaw) return null

  try {
    return JSON.parse(userRaw) as TelegramUser
  } catch {
    return null
  }
}

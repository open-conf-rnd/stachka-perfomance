import crypto from 'node:crypto'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

export function validateInitData(initData: string): TelegramUser | null {
  const botToken = process.env.TG_BOT_API ?? ''
  if (!botToken || !initData) return null

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null

  params.delete('hash')
  const entries = [...params.entries()].sort(([a], [b]) => a.localeCompare(b))
  const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join('\n')

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
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

/**
 * Sends a Telegram message to a user. Fire-and-forget; errors are logged but not thrown.
 * @param chatId - Telegram user id (numeric string), same as UserIdentity.externalId for provider telegram
 * @param text - Message text
 */
export async function sendTelegramMessage(
  chatId: string,
  text: string
): Promise<void> {
  const botToken = process.env.TG_BOT_API ?? ''
  if (!botToken) return

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    )
    if (!res.ok) {
      const err = (await res.json()) as { description?: string }
      console.warn('[telegram] sendMessage failed:', res.status, err.description)
    }
  } catch (err) {
    console.warn('[telegram] sendMessage error:', err)
  }
}

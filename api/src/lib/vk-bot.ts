import crypto from 'node:crypto'

const VK_API = 'https://api.vk.com/method'

/**
 * Личное сообщение пользователю VK от имени сообщества (нужен ключ с доступом к сообщениям).
 */
export async function sendVkUserMessage(peerVkUserId: string, text: string): Promise<void> {
  const token = process.env.VK_GROUP_TOKEN ?? ''
  if (!token) return

  const randomId = crypto.randomInt(1, 2_147_483_647)
  const v = process.env.VK_API_VERSION?.trim() || '5.131'

  try {
    const res = await fetch(`${VK_API}/messages.send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        access_token: token,
        v,
        random_id: String(randomId),
        user_id: peerVkUserId,
        message: text,
      }),
    })
    const data = (await res.json()) as { error?: { error_msg?: string } }
    if (data.error) {
      console.warn('[vk] messages.send failed:', data.error.error_msg)
    }
  } catch (err) {
    console.warn('[vk] messages.send error:', err)
  }
}

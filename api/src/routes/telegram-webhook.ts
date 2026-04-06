import type { FastifyInstance } from 'fastify'
import { sendTelegramMessage } from '../lib/telegram.js'

const WEBHOOK_SECRET = process.env.TG_WEBHOOK_SECRET?.trim() ?? ''
/** Публичный URL мини-приложения (HTTPS), кнопка «Открыть приложение» в /start */
const MINI_APP_URL = (process.env.TG_MINI_APP_PUBLIC_URL ?? 'https://open-conf-rnd.pro').replace(/\/$/, '')

type TelegramMessage = {
  message_id?: number
  chat?: { id?: number }
  text?: string
}

type TelegramUpdate = {
  message?: TelegramMessage
}

function isStartCommand(text: string | undefined): boolean {
  if (!text) return false
  const t = text.trim()
  return t === '/start' || t.startsWith('/start ')
}

/**
 * Входящие обновления Telegram Bot API (setWebhook).
 * При /start — приветствие и кнопка Web App, чтобы пользователь не терялся без меню.
 */
export async function telegramWebhookRoutes(app: FastifyInstance) {
  app.post<{ Body: TelegramUpdate }>('/api/telegram/webhook', async (req, reply) => {
    if (WEBHOOK_SECRET) {
      const header = req.headers['x-telegram-bot-api-secret-token']
      const token = typeof header === 'string' ? header : header?.[0]
      if (token !== WEBHOOK_SECRET) {
        return reply.status(403).send('forbidden')
      }
    }

    const body = req.body ?? {}
    const msg = body.message
    const chatId = msg?.chat?.id
    if (chatId == null) {
      return reply.send({ ok: true })
    }

    if (isStartCommand(msg?.text)) {
      const welcome =
        'Привет! Это бот интерактивного приложения для доклада.\n\n' +
        'Чтобы попасть в приложение, нажмите кнопку <b>Открыть приложение</b> ниже. ' +
        'Если кнопки не видно — откройте меню (☰) слева от поля ввода и выберите мини-приложение.'

      await sendTelegramMessage(String(chatId), welcome, {
        replyMarkup: {
          inline_keyboard: [
            [{ text: 'Открыть приложение', web_app: { url: `${MINI_APP_URL}/` } }],
          ],
        },
      })
    }

    return reply.send({ ok: true })
  })
}

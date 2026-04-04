import type { FastifyInstance } from 'fastify'

const CALLBACK_SECRET = process.env.VK_CALLBACK_SECRET ?? ''
const CONFIRMATION = process.env.VK_CALLBACK_CONFIRMATION ?? ''

/**
 * Callback API сообщества VK.
 * @see http://dev.vk.com/ru/api/bots/getting-started
 */
export async function vkCallbackRoutes(app: FastifyInstance) {
  app.post<{
    Body: {
      type?: string
      group_id?: number
      secret?: string
      object?: Record<string, unknown>
    }
  }>('/api/vk/callback', async (req, reply) => {
    const body = req.body ?? {}

    // Подтверждение адреса: VK шлёт только { type, group_id }, без secret — проверку секрета не применяем.
    if (body.type === 'confirmation') {
      reply.type('text/plain').send(CONFIRMATION || 'ok')
      return
    }

    if (CALLBACK_SECRET && body.secret !== CALLBACK_SECRET) {
      return reply.status(403).send('forbidden')
    }

    if (body.type === 'message_new') {
      // Заготовка: при необходимости обрабатывать входящие сообщения боту
      req.log.info({ type: body.type, group_id: body.group_id }, '[vk] callback event')
    }

    reply.type('text/plain').send('ok')
  })
}

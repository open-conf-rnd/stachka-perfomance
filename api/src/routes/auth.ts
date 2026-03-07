import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { validateInitData } from '../lib/telegram.js'

export async function authRoutes(app: FastifyInstance) {
  app.get('/api/me', async (req, reply) => {
    const initData = req.headers['x-telegram-init-data'] as string | undefined
    if (!initData) {
      return reply.status(401).send({ error: 'Missing init data' })
    }

    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    const user = await prisma.user.findUnique({
      where: { id: String(tgUser.id) },
    })

    return { registered: !!user, user }
  })

  app.post('/api/register', async (req, reply) => {
    const initData = req.headers['x-telegram-init-data'] as string | undefined
    if (!initData) {
      return reply.status(401).send({ error: 'Missing init data' })
    }

    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    const userId = String(tgUser.id)
    const existing = await prisma.user.findUnique({ where: { id: userId } })

    if (existing) {
      return { registered: true, isNew: false, user: existing }
    }

    const user = await prisma.user.create({
      data: {
        id: userId,
        username: tgUser.username ?? null,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name ?? null,
        photoUrl: tgUser.photo_url ?? null,
      },
    })

    return { registered: true, isNew: true, user }
  })
}

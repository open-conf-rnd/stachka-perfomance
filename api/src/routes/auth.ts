import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { validateInitData } from '../lib/telegram.js'
import { getUserFromPrimaryAuthHeader } from '../lib/telegram-resolve.js'
import { verifyAndParseVkLaunch } from '../lib/vk-launch.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'

function headerStr(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string' && value.length > 0) return value
  if (Array.isArray(value) && value[0]) return value[0]
  return undefined
}

export async function authRoutes(app: FastifyInstance) {
  app.get('/api/me', async (req, reply) => {
    const tg = headerStr(req.headers['x-telegram-init-data'])
    const vk = headerStr(req.headers['x-vk-launch-params'])
    if (!tg && !vk) {
      return reply.status(401).send({ error: 'Missing init data' })
    }

    const resolved = await getUserFromPrimaryAuthHeader(req.headers)
    if (resolved.ok) {
      return { registered: true, user: resolved.user }
    }
    if (resolved.error === 'missing_init' || resolved.error === 'invalid_init') {
      return reply.status(401).send({ error: 'Invalid init data' })
    }
    return { registered: false, user: null }
  })

  app.post('/api/register', async (req, reply) => {
    const initData = headerStr(req.headers['x-telegram-init-data'])
    const vkRaw = headerStr(req.headers['x-vk-launch-params'])

    if (initData) {
      const tgUser = validateInitData(initData)
      if (!tgUser) {
        return reply.status(401).send({ error: 'Invalid init data' })
      }

      const externalId = String(tgUser.id)
      const existingIdentity = await prisma.userIdentity.findUnique({
        where: {
          provider_externalId: { provider: 'telegram', externalId },
        },
        include: { user: true },
      })

      if (existingIdentity) {
        return { registered: true, isNew: false, user: existingIdentity.user }
      }

      const user = await prisma.user.create({
        data: {
          username: tgUser.username ?? null,
          firstName: tgUser.first_name,
          lastName: tgUser.last_name ?? null,
          photoUrl: tgUser.photo_url ?? null,
          identities: {
            create: {
              provider: 'telegram',
              externalId,
            },
          },
        },
      })

      await wsBroadcast(
        'participant:registered',
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName ?? null,
          username: user.username ?? null,
          photoUrl: user.photoUrl ?? null,
        },
        'display:participants'
      )

      return { registered: true, isNew: true, user }
    }

    if (vkRaw) {
      const secret = process.env.VK_APP_SECRET ?? ''
      const appId = process.env.VK_APP_ID?.trim() || undefined
      const parsed = verifyAndParseVkLaunch(vkRaw, secret, appId)
      if (!parsed) {
        return reply.status(401).send({ error: 'Invalid init data' })
      }

      const existingIdentity = await prisma.userIdentity.findUnique({
        where: {
          provider_externalId: { provider: 'vk', externalId: parsed.vkUserId },
        },
        include: { user: true },
      })

      if (existingIdentity) {
        return { registered: true, isNew: false, user: existingIdentity.user }
      }

      const user = await prisma.user.create({
        data: {
          username: null,
          firstName: 'Участник',
          lastName: null,
          photoUrl: null,
          identities: {
            create: {
              provider: 'vk',
              externalId: parsed.vkUserId,
            },
          },
        },
      })

      await wsBroadcast(
        'participant:registered',
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName ?? null,
          username: user.username ?? null,
          photoUrl: user.photoUrl ?? null,
        },
        'display:participants'
      )

      return { registered: true, isNew: true, user }
    }

    return reply.status(401).send({ error: 'Missing init data' })
  })

  app.post('/api/auth/link', async (req, reply) => {
    const initData = headerStr(req.headers['x-telegram-init-data'])
    const vkRaw = headerStr(req.headers['x-vk-launch-params'])
    if (!initData || !vkRaw) {
      return reply
        .status(400)
        .send({ error: 'Both x-telegram-init-data and x-vk-launch-params are required' })
    }

    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    const secret = process.env.VK_APP_SECRET ?? ''
    const appId = process.env.VK_APP_ID?.trim() || undefined
    const vkParsed = verifyAndParseVkLaunch(vkRaw, secret, appId)
    if (!vkParsed) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    const tgExt = String(tgUser.id)
    const vkExt = vkParsed.vkUserId

    const [identityTg, identityVk] = await Promise.all([
      prisma.userIdentity.findUnique({
        where: { provider_externalId: { provider: 'telegram', externalId: tgExt } },
        include: { user: true },
      }),
      prisma.userIdentity.findUnique({
        where: { provider_externalId: { provider: 'vk', externalId: vkExt } },
        include: { user: true },
      }),
    ])

    if (identityTg && identityVk) {
      if (identityTg.userId === identityVk.userId) {
        return { linked: true, alreadyLinked: true, user: identityTg.user }
      }
      return reply
        .status(409)
        .send({ error: 'Telegram and VK are already linked to different accounts' })
    }

    if (identityTg && !identityVk) {
      await prisma.userIdentity.create({
        data: {
          userId: identityTg.userId,
          provider: 'vk',
          externalId: vkExt,
        },
      })
      const user = await prisma.user.findUniqueOrThrow({ where: { id: identityTg.userId } })
      return { linked: true, alreadyLinked: false, user }
    }

    if (!identityTg && identityVk) {
      await prisma.userIdentity.create({
        data: {
          userId: identityVk.userId,
          provider: 'telegram',
          externalId: tgExt,
        },
      })
      const user = await prisma.user.findUniqueOrThrow({ where: { id: identityVk.userId } })
      return { linked: true, alreadyLinked: false, user }
    }

    return reply.status(400).send({ error: 'Register in the app on at least one platform first' })
  })
}

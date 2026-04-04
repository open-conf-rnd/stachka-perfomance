import crypto from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { mergeTelegramVkIdentities } from '../lib/account-link-merge.js'
import { validateInitData } from '../lib/telegram.js'
import { getUserFromPrimaryAuthHeader } from '../lib/telegram-resolve.js'
import { verifyAndParseVkLaunch } from '../lib/vk-launch.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'

const LINK_TOKEN_TTL_MS = 15 * 60 * 1000

function headerStr(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string' && value.length > 0) return value
  if (Array.isArray(value) && value[0]) return value[0]
  return undefined
}

function newLinkToken(): string {
  return crypto.randomBytes(16).toString('hex')
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

  /** Шаг 1 (VK): выдать токен и ссылку в Telegram для завершения привязки */
  app.post('/api/auth/vk-link-token', async (req, reply) => {
    const vkRaw = headerStr(req.headers['x-vk-launch-params'])
    if (!vkRaw) {
      return reply.status(401).send({ error: 'VK launch params required' })
    }
    const secret = process.env.VK_APP_SECRET ?? ''
    const appId = process.env.VK_APP_ID?.trim() || undefined
    const parsed = verifyAndParseVkLaunch(vkRaw, secret, appId)
    if (!parsed) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    await prisma.accountLinkToken.deleteMany({
      where: { vkUserId: parsed.vkUserId, usedAt: null },
    })

    const token = newLinkToken()
    const expiresAt = new Date(Date.now() + LINK_TOKEN_TTL_MS)
    await prisma.accountLinkToken.create({
      data: {
        token,
        vkUserId: parsed.vkUserId,
        expiresAt,
      },
    })

    return {
      token,
      expiresInMinutes: 15,
      telegramStartApp: `al${token}`,
    }
  })

  /** Шаг 1 (Telegram): выдать токен и ссылку во ВКонтакте (#account_link=…) для завершения привязки */
  app.post('/api/auth/tg-link-token', async (req, reply) => {
    const initData = headerStr(req.headers['x-telegram-init-data'])
    if (!initData) {
      return reply.status(401).send({ error: 'Telegram init data required' })
    }
    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }
    const tgExt = String(tgUser.id)

    await prisma.accountLinkToken.deleteMany({
      where: { tgExtId: tgExt, usedAt: null },
    })

    const token = newLinkToken()
    const expiresAt = new Date(Date.now() + LINK_TOKEN_TTL_MS)
    await prisma.accountLinkToken.create({
      data: {
        token,
        tgExtId: tgExt,
        expiresAt,
      },
    })

    return {
      token,
      expiresInMinutes: 15,
    }
  })

  /** Завершить привязку (заголовок второй платформы + токен из vk-link-token или tg-link-token) */
  app.post<{
    Body: { token?: string }
  }>('/api/auth/complete-account-link', async (req, reply) => {
    const rawToken = typeof req.body?.token === 'string' ? req.body.token.trim() : ''
    if (!/^[a-f0-9]{32}$/i.test(rawToken)) {
      return reply.status(400).send({ error: 'Invalid token' })
    }
    const token = rawToken.toLowerCase()

    const row = await prisma.accountLinkToken.findUnique({ where: { token } })
    if (!row || row.usedAt || row.expiresAt < new Date()) {
      return reply.status(400).send({ error: 'Invalid or expired token' })
    }

    const initData = headerStr(req.headers['x-telegram-init-data'])
    const vkRaw = headerStr(req.headers['x-vk-launch-params'])

    if (initData && row.vkUserId) {
      const tgUser = validateInitData(initData)
      if (!tgUser) {
        return reply.status(401).send({ error: 'Invalid init data' })
      }
      const merged = await mergeTelegramVkIdentities(String(tgUser.id), row.vkUserId)
      if (!merged.ok) {
        return reply.status(merged.code).send({ error: merged.error })
      }
      await prisma.accountLinkToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      })
      return {
        linked: true,
        alreadyLinked: merged.alreadyLinked,
        user: merged.user,
      }
    }

    if (vkRaw && row.tgExtId) {
      const secret = process.env.VK_APP_SECRET ?? ''
      const appId = process.env.VK_APP_ID?.trim() || undefined
      const vkParsed = verifyAndParseVkLaunch(vkRaw, secret, appId)
      if (!vkParsed) {
        return reply.status(401).send({ error: 'Invalid init data' })
      }
      const merged = await mergeTelegramVkIdentities(row.tgExtId, vkParsed.vkUserId)
      if (!merged.ok) {
        return reply.status(merged.code).send({ error: merged.error })
      }
      await prisma.accountLinkToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      })
      return {
        linked: true,
        alreadyLinked: merged.alreadyLinked,
        user: merged.user,
      }
    }

    return reply.status(400).send({ error: 'Wrong client for this token' })
  })
}

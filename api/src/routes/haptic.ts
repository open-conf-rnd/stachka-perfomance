import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { validateInitData } from '../lib/telegram.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'

const BINGO_HAPTIC_TASK_ID = process.env.BINGO_HAPTIC_TASK_ID || 'cmmgveyhg00066po3yrtqv57l'

const impactStyles = new Set(['light', 'medium', 'heavy', 'rigid', 'soft'])
const notificationTypes = new Set(['success', 'warning', 'error'])

type HapticType = 'impact' | 'notification'

interface HapticPayload {
  type: HapticType
  style?: string
  notificationType?: string
}

function normalizePayload(input: unknown): HapticPayload | null {
  if (!input || typeof input !== 'object') return null
  const body = input as Record<string, unknown>

  const type = body.type
  if (type !== 'impact' && type !== 'notification') return null

  if (type === 'impact') {
    const style = typeof body.style === 'string' ? body.style : 'medium'
    if (!impactStyles.has(style)) return null
    return { type, style }
  }

  const notificationType =
    typeof body.notificationType === 'string' ? body.notificationType : 'success'
  if (!notificationTypes.has(notificationType)) return null
  return { type, notificationType }
}

const ALL_TRIGGER_KEYS = [
  'impact:light',
  'impact:medium',
  'impact:heavy',
  'impact:rigid',
  'impact:soft',
  'notification:success',
  'notification:warning',
  'notification:error',
] as const

function getInitData(headerValue: unknown): string | null {
  return typeof headerValue === 'string' && headerValue.length > 0 ? headerValue : null
}

export async function hapticRoutes(app: FastifyInstance) {
  app.post<{ Body: { type: string; style?: string; notificationType?: string } }>(
    '/api/haptic/track',
    async (req, reply) => {
      const initData = getInitData(req.headers['x-telegram-init-data'])
      if (!initData) {
        return reply.status(401).send({ error: 'Missing init data' })
      }

      const tgUser = validateInitData(initData)
      if (!tgUser) {
        return reply.status(401).send({ error: 'Invalid init data' })
      }

      const userId = String(tgUser.id)
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        return reply.status(403).send({ error: 'User is not registered' })
      }

      const payload = normalizePayload(req.body)
      if (!payload) {
        return reply.status(400).send({
          error:
            'Invalid payload. Use { type: "impact", style: "light|medium|heavy|rigid|soft" } or { type: "notification", notificationType: "success|warning|error" }',
        })
      }

      const triggerKey =
        payload.type === 'impact'
          ? `impact:${payload.style}`
          : `notification:${payload.notificationType}`

      if (!ALL_TRIGGER_KEYS.includes(triggerKey as (typeof ALL_TRIGGER_KEYS)[number])) {
        return reply.status(400).send({ error: 'Invalid trigger' })
      }

      await prisma.hapticTrigger.upsert({
        where: { userId_triggerKey: { userId, triggerKey } },
        create: { userId, triggerKey },
        update: {},
      })

      const count = await prisma.hapticTrigger.count({ where: { userId } })
      if (BINGO_HAPTIC_TASK_ID && count >= ALL_TRIGGER_KEYS.length) {
        await completeBingoTaskForUser(BINGO_HAPTIC_TASK_ID, userId)
      }

      return { success: true, triggered: triggerKey, count }
    }
  )

  app.post('/api/haptic/trigger', async (req, reply) => {
    const payload = normalizePayload(req.body)
    if (!payload) {
      return reply.status(400).send({
        error:
          'Invalid payload. Use { type: "impact", style: "light|medium|heavy|rigid|soft" } or { type: "notification", notificationType: "success|warning|error" }',
      })
    }

    await wsBroadcast('haptic:trigger', payload)
    return { success: true, payload }
  })
}

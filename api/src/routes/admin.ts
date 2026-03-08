import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { requireAdmin } from '../lib/admin.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'

const impactStyles = new Set(['light', 'medium', 'heavy', 'rigid', 'soft'])
const notificationTypes = new Set(['success', 'warning', 'error'])

function normalizeHapticPayload(input: unknown): { type: 'impact'; style: string } | { type: 'notification'; notificationType: string } | null {
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

export async function adminRoutes(app: FastifyInstance) {
  app.get('/api/admin/participants', async (req, reply) => {
    const auth = requireAdmin(req.headers['x-telegram-init-data'])
    if (!auth.ok) {
      return reply.status(auth.status).send(auth.body)
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        _count: { select: { completions: true } },
      },
      orderBy: { completions: { _count: 'desc' } },
    })

    return users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName ?? null,
      username: u.username ?? null,
      completionsCount: u._count.completions,
    }))
  })

  app.post<{
    Body: { userId: string; type: string; style?: string; notificationType?: string }
  }>('/api/admin/haptic/send', async (req, reply) => {
    const auth = requireAdmin(req.headers['x-telegram-init-data'])
    if (!auth.ok) {
      return reply.status(auth.status).send(auth.body)
    }

    const { userId } = req.body ?? {}
    if (!userId || typeof userId !== 'string') {
      return reply.status(400).send({ error: 'userId is required' })
    }

    const payload = normalizeHapticPayload(req.body)
    if (!payload) {
      return reply.status(400).send({
        error:
          'Invalid payload. Use { type: "impact", style: "light|medium|heavy|rigid|soft" } or { type: "notification", notificationType: "success|warning|error" }',
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })
    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    await wsBroadcast('haptic:trigger', payload, `user:${userId}`)
    return { success: true, payload }
  })

  app.get('/api/admin/check', async (req, reply) => {
    const auth = requireAdmin(req.headers['x-telegram-init-data'])
    if (!auth.ok) {
      return reply.status(auth.status).send(auth.body)
    }
    return { admin: true }
  })
}

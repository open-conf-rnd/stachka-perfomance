import type { FastifyInstance } from 'fastify'
import { wsBroadcast } from '../lib/ws-broadcast.js'

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

export async function hapticRoutes(app: FastifyInstance) {
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

import type { FastifyInstance } from 'fastify'
import { requireAdmin } from '../lib/admin.js'
import { prisma } from '../lib/prisma.js'

const FEATURE_KEYS = ['bingo', 'qr', 'polls', 'tap', 'reaction', 'haptic', 'support', 'bingoShare'] as const

type FeatureKey = (typeof FEATURE_KEYS)[number]

function isFeatureKey(value: string): value is FeatureKey {
  return (FEATURE_KEYS as readonly string[]).includes(value)
}

function buildFeatureState(enabledKeys: string[]): Array<{ key: FeatureKey; enabled: boolean }> {
  const enabledSet = new Set(enabledKeys)
  return FEATURE_KEYS.map((key) => ({ key, enabled: enabledSet.has(key) }))
}

export async function featureRoutes(app: FastifyInstance) {
  app.get('/api/features', async () => {
    const enabledFeatures = await prisma.featureGate.findMany({
      where: {
        key: { in: [...FEATURE_KEYS] },
        enabled: true,
      },
      select: { key: true },
    })

    return {
      enabled: enabledFeatures.map((feature) => feature.key).filter(isFeatureKey),
    }
  })

  app.get('/api/admin/features', async (req, reply) => {
    const auth = requireAdmin(req.headers['x-telegram-init-data'])
    if (!auth.ok) {
      return reply.status(auth.status).send(auth.body)
    }

    const enabledFeatures = await prisma.featureGate.findMany({
      where: {
        key: { in: [...FEATURE_KEYS] },
        enabled: true,
      },
      select: { key: true },
    })

    return buildFeatureState(enabledFeatures.map((feature) => feature.key))
  })

  app.put<{
    Params: { key: string }
    Body: { enabled?: boolean }
  }>('/api/admin/features/:key', async (req, reply) => {
    const auth = requireAdmin(req.headers['x-telegram-init-data'])
    if (!auth.ok) {
      return reply.status(auth.status).send(auth.body)
    }

    const { key } = req.params
    if (!isFeatureKey(key)) {
      return reply.status(400).send({ error: 'Unknown feature key' })
    }

    const enabled = req.body?.enabled
    if (typeof enabled !== 'boolean') {
      return reply.status(400).send({ error: 'enabled must be boolean' })
    }

    await prisma.featureGate.upsert({
      where: { key },
      create: { key, enabled },
      update: { enabled },
    })

    return { key, enabled }
  })
}

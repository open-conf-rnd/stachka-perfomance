import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { validateInitData } from '../lib/telegram.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'

const TAP_GOAL = Number(process.env.TAP_GOAL || 100)
const BINGO_TAP10_TASK_ID = process.env.BINGO_TAP10_TASK_ID || ''

function getInitData(headerValue: unknown): string | null {
  return typeof headerValue === 'string' && headerValue.length > 0 ? headerValue : null
}

async function getTapTotals(userId: string) {
  const [user, sum] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tapCount: true, firstName: true, username: true },
    }),
    prisma.user.aggregate({
      _sum: { tapCount: true },
    }),
  ])

  return {
    user,
    userCount: user?.tapCount ?? 0,
    total: sum._sum.tapCount ?? 0,
    goal: TAP_GOAL,
  }
}

export async function tapRoutes(app: FastifyInstance) {
  app.get('/api/tap', async (req, reply) => {
    const initData = getInitData(req.headers['x-telegram-init-data'])
    if (!initData) {
      return reply.status(401).send({ error: 'Missing init data' })
    }

    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    const userId = String(tgUser.id)
    const totals = await getTapTotals(userId)
    if (!totals.user) {
      return reply.status(403).send({ error: 'User is not registered' })
    }

    return {
      userCount: totals.userCount,
      total: totals.total,
      goal: totals.goal,
    }
  })

  app.post('/api/tap', async (req, reply) => {
    const initData = getInitData(req.headers['x-telegram-init-data'])
    if (!initData) {
      return reply.status(401).send({ error: 'Missing init data' })
    }

    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    const userId = String(tgUser.id)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tapCount: true },
    })

    if (!user) {
      return reply.status(403).send({ error: 'User is not registered' })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { tapCount: { increment: 1 } },
    })

    const totals = await getTapTotals(userId)
    if (!totals.user) {
      return reply.status(403).send({ error: 'User is not registered' })
    }

    await wsBroadcast('tap:update', {
      total: totals.total,
      goal: totals.goal,
      userCount: totals.userCount,
      user: {
        id: totals.user.id,
        firstName: totals.user.firstName,
        username: totals.user.username,
      },
    })

    if (totals.total === totals.goal) {
      await wsBroadcast('tap:goal', { total: totals.total, goal: totals.goal })
    }

    if (BINGO_TAP10_TASK_ID && totals.userCount >= 10) {
      await completeBingoTaskForUser(BINGO_TAP10_TASK_ID, userId)
    }

    return {
      success: true,
      userCount: totals.userCount,
      total: totals.total,
      goal: totals.goal,
    }
  })
}

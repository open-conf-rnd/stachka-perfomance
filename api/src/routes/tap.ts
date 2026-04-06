import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { requireAdmin } from '../lib/admin.js'
import { getUserFromPrimaryAuthHeader, replyIfUserAuthMissing } from '../lib/telegram-resolve.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'

const TAP_GOAL = Number(process.env.TAP_GOAL || 100) || 100
const BINGO_TAP10_TASK_ID = process.env.BINGO_TAP10_TASK_ID?.trim() ?? ''
const TAP_SESSION_ROW_ID = 1

async function getTapSessionOpen(): Promise<boolean> {
  const row = await prisma.tapSessionState.findUnique({
    where: { id: TAP_SESSION_ROW_ID },
  })
  return row?.tapOpen ?? true
}

async function setTapSessionOpen(open: boolean): Promise<void> {
  await prisma.tapSessionState.upsert({
    where: { id: TAP_SESSION_ROW_ID },
    create: { id: TAP_SESSION_ROW_ID, tapOpen: open },
    update: { tapOpen: open },
  })
  await wsBroadcast('tap:session', { open })
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
  /** Общий счётчик для экрана презентации (без авторизации; только сумма и цель). */
  app.get('/api/tap/aggregate', async () => {
    const sum = await prisma.user.aggregate({
      _sum: { tapCount: true },
    })
    return {
      total: sum._sum.tapCount ?? 0,
      goal: TAP_GOAL,
    }
  })

  app.get('/api/tap', async (req, reply) => {
    const auth = await getUserFromPrimaryAuthHeader(req.headers)
    if (!replyIfUserAuthMissing(reply, auth)) {
      return
    }
    const userId = auth.user.id
    const totals = await getTapTotals(userId)
    if (!totals.user) {
      return reply.status(403).send({ error: 'User is not registered' })
    }

    const sessionOpen = await getTapSessionOpen()
    return {
      userCount: totals.userCount,
      total: totals.total,
      goal: totals.goal,
      sessionOpen,
    }
  })

  app.post<{ Body: { open?: boolean } }>('/api/tap/session', async (req, reply) => {
    const auth = requireAdmin(req.headers)
    if (!auth.ok) {
      return reply.status(auth.status).send(auth.body)
    }
    const open = req.body?.open
    if (typeof open !== 'boolean') {
      return reply.status(400).send({ error: 'Expected JSON body { open: boolean }' })
    }
    await setTapSessionOpen(open)
    return { success: true, open }
  })

  app.post('/api/tap', async (req, reply) => {
    const auth = await getUserFromPrimaryAuthHeader(req.headers)
    if (!replyIfUserAuthMissing(reply, auth)) {
      return
    }
    const userId = auth.user.id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tapCount: true },
    })

    if (!user) {
      return reply.status(403).send({ error: 'User is not registered' })
    }

    const sessionOpen = await getTapSessionOpen()
    if (!sessionOpen) {
      const nextCount = Math.max(0, user.tapCount - 1)
      if (nextCount !== user.tapCount) {
        await prisma.user.update({
          where: { id: userId },
          data: { tapCount: nextCount },
        })
      }
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
      return {
        success: false,
        falseStart: true,
        userCount: totals.userCount,
        total: totals.total,
        goal: totals.goal,
      }
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
      const result = await completeBingoTaskForUser(BINGO_TAP10_TASK_ID, userId)
      if (!result.ok) {
        req.log.warn({ taskId: BINGO_TAP10_TASK_ID, userId, error: result.error }, 'bingo tap10 task not completed')
      }
    }

    return {
      success: true,
      userCount: totals.userCount,
      total: totals.total,
      goal: totals.goal,
    }
  })
}

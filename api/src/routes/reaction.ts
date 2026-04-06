import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { requireAdmin } from '../lib/admin.js'
import { getUserFromPrimaryAuthHeader, replyIfUserAuthMissing } from '../lib/telegram-resolve.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'

const BINGO_REACTION_TOP3_TASK_ID = process.env.BINGO_REACTION_TOP3_TASK_ID?.trim() ?? ''

const COUNTDOWN_SECONDS = Number(process.env.REACTION_COUNTDOWN_SECONDS || 3)
const LEADERBOARD_DELAY_SECONDS = Number(process.env.REACTION_LEADERBOARD_DELAY_SECONDS || 5)

let roundTimers: NodeJS.Timeout[] = []

function getInitData(headerValue: unknown): string | null {
  return typeof headerValue === 'string' && headerValue.length > 0 ? headerValue : null
}

function clearRoundTimers() {
  for (const timer of roundTimers) {
    clearTimeout(timer)
  }
  roundTimers = []
}

async function getCurrentRound() {
  return prisma.reactionRound.findFirst({
    where: {
      status: { in: ['PENDING', 'ACTIVE'] },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getRoundNumberById(roundId: string): Promise<number> {
  const allOrdered = await prisma.reactionRound.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  })
  const index = allOrdered.findIndex((r: { id: string }) => r.id === roundId)
  return index >= 0 ? index + 1 : 0
}

async function getRoundNumberMap(): Promise<Map<string, number>> {
  const allOrdered = await prisma.reactionRound.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  })
  const map = new Map<string, number>()
  allOrdered.forEach((r: { id: string }, i: number) => map.set(r.id, i + 1))
  return map
}

async function finishRoundAndBroadcastLeaderboard(roundId: string) {
  const round = await prisma.reactionRound.findUnique({
    where: { id: roundId },
    select: { id: true },
  })
  if (!round) return

  const roundNumber = await getRoundNumberById(roundId)

  const taps = await prisma.reactionTap.findMany({
    where: { roundId },
    include: {
      user: {
        select: { id: true, firstName: true, username: true },
      },
    },
    orderBy: { tapTime: 'asc' },
  })

  const results = taps.map((tap: { user: { id: string; firstName: string; username: string | null }; tapTime: Date }, index: number) => ({
    place: index + 1,
    user: tap.user,
    tapTime: tap.tapTime.toISOString(),
  }))

  await prisma.reactionRound.updateMany({
    where: { id: roundId },
    data: { status: 'FINISHED' },
  })

  await wsBroadcast('reaction:leaderboard', { roundId, roundNumber, results })
}

export async function reactionRoutes(app: FastifyInstance) {
  app.get('/api/reaction/current', async () => {
    const round = await getCurrentRound()
    if (!round) return { round: null }

    const tapsCount = await prisma.reactionTap.count({ where: { roundId: round.id } })
    const roundNumber = await getRoundNumberById(round.id)

    let secondsRemaining: number | undefined
    if (round.status === 'PENDING') {
      const elapsedMs = Date.now() - round.createdAt.getTime()
      secondsRemaining = Math.max(0, Math.ceil((COUNTDOWN_SECONDS * 1000 - elapsedMs) / 1000))
    }

    return {
      round: {
        id: round.id,
        roundNumber,
        status: round.status,
        createdAt: round.createdAt,
        ...(secondsRemaining !== undefined ? { secondsRemaining } : {}),
      },
      tapsCount,
    }
  })

  app.get('/api/reaction/rounds', async () => {
    const rounds = await prisma.reactionRound.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        _count: { select: { taps: true } },
      },
    })
    const numberMap = await getRoundNumberMap()
    return rounds.map((r: { id: string; status: string; createdAt: Date; _count: { taps: number } }) => ({
      id: r.id,
      roundNumber: numberMap.get(r.id) ?? 0,
      status: r.status,
      createdAt: r.createdAt,
      participantsCount: r._count.taps,
    }))
  })

  app.get<{ Params: { id: string } }>('/api/reaction/rounds/:id', async (req, reply) => {
    const round = await prisma.reactionRound.findUnique({
      where: { id: req.params.id },
      include: {
        taps: {
          include: {
            user: { select: { id: true, firstName: true, username: true } },
          },
          orderBy: { tapTime: 'asc' },
        },
      },
    })
    if (!round) {
      return reply.status(404).send({ error: 'Round not found' })
    }
    const results = round.taps.map((tap: { user: { id: string; firstName: string; username: string | null }; tapTime: Date }, index: number) => ({
      place: index + 1,
      user: tap.user,
      tapTime: tap.tapTime.toISOString(),
    }))
    const roundNumber = await getRoundNumberById(round.id)
    return {
      id: round.id,
      roundNumber,
      status: round.status,
      createdAt: round.createdAt,
      results,
    }
  })

  app.post('/api/reaction/start', async (req, reply) => {
    const auth = requireAdmin(req.headers)
    if (!auth.ok) {
      return reply.status(auth.status).send(auth.body)
    }

    clearRoundTimers()

    await prisma.reactionRound.updateMany({
      where: { status: { in: ['PENDING', 'ACTIVE'] } },
      data: { status: 'FINISHED' },
    })

    const round = await prisma.reactionRound.create({
      data: { status: 'PENDING' },
    })

    const roundNumber = await getRoundNumberById(round.id)

    await wsBroadcast('reaction:countdown', {
      roundId: round.id,
      roundNumber,
      seconds: COUNTDOWN_SECONDS,
    })

    const activateTimer = setTimeout(async () => {
      try {
        const updated = await prisma.reactionRound.updateMany({
          where: { id: round.id },
          data: { status: 'ACTIVE' },
        })
        if (updated.count > 0) {
          await wsBroadcast('reaction:go', { roundId: round.id, roundNumber })
        }
      } catch {
        // ignore timer errors when round is already cleaned up
      }
    }, COUNTDOWN_SECONDS * 1000)

    const leaderboardTimer = setTimeout(async () => {
      try {
        await finishRoundAndBroadcastLeaderboard(round.id)
      } catch {
        // ignore timer errors when round is already cleaned up
      }
    }, (COUNTDOWN_SECONDS + LEADERBOARD_DELAY_SECONDS) * 1000)

    roundTimers.push(activateTimer, leaderboardTimer)

    return {
      success: true,
      roundId: round.id,
      countdownSeconds: COUNTDOWN_SECONDS,
      leaderboardDelaySeconds: LEADERBOARD_DELAY_SECONDS,
    }
  })

  app.post('/api/reaction/tap', async (req, reply) => {
    const auth = await getUserFromPrimaryAuthHeader(req.headers)
    if (!replyIfUserAuthMissing(reply, auth)) {
      return
    }
    const userId = auth.user.id
    const user = {
      id: auth.user.id,
      firstName: auth.user.firstName,
      username: auth.user.username,
    }

    const round = await getCurrentRound()
    if (!round || round.status !== 'ACTIVE') {
      return reply.status(409).send({ error: 'No active round' })
    }

    const existing = await prisma.reactionTap.findUnique({
      where: { roundId_userId: { roundId: round.id, userId } },
    })
    if (existing) {
      return { success: true, alreadyTapped: true, roundId: round.id }
    }

    const tap = await prisma.reactionTap.create({
      data: { roundId: round.id, userId },
    })

    const top3 = await prisma.reactionTap.findMany({
      where: { roundId: round.id },
      include: {
        user: {
          select: { id: true, firstName: true, username: true },
        },
      },
      orderBy: { tapTime: 'asc' },
      take: 3,
    })

    const place = top3.findIndex((item: { user: { id: string } }) => item.user.id === userId) + 1
    if (place > 0 && place <= 3) {
      await wsBroadcast('reaction:podium', {
        roundId: round.id,
        place,
        user,
      })
      if (BINGO_REACTION_TOP3_TASK_ID) {
        await completeBingoTaskForUser(BINGO_REACTION_TOP3_TASK_ID, userId)
      }
    }

    return {
      success: true,
      alreadyTapped: false,
      roundId: round.id,
      tapTime: tap.tapTime.toISOString(),
    }
  })
}

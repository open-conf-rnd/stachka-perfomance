import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { validateInitData } from '../lib/telegram.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'

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

async function finishRoundAndBroadcastLeaderboard(roundId: string) {
  const taps = await prisma.reactionTap.findMany({
    where: { roundId },
    include: {
      user: {
        select: { id: true, firstName: true, username: true },
      },
    },
    orderBy: { tapTime: 'asc' },
  })

  const results = taps.map((tap, index) => ({
    place: index + 1,
    user: tap.user,
    tapTime: tap.tapTime.toISOString(),
  }))

  await prisma.reactionRound.update({
    where: { id: roundId },
    data: { status: 'FINISHED' },
  })

  await wsBroadcast('reaction:leaderboard', { roundId, results })
}

export async function reactionRoutes(app: FastifyInstance) {
  app.get('/api/reaction/current', async () => {
    const round = await getCurrentRound()
    if (!round) return { round: null }

    const tapsCount = await prisma.reactionTap.count({ where: { roundId: round.id } })
    return { round, tapsCount }
  })

  app.post('/api/reaction/start', async () => {
    clearRoundTimers()

    await prisma.reactionRound.updateMany({
      where: { status: { in: ['PENDING', 'ACTIVE'] } },
      data: { status: 'FINISHED' },
    })

    const round = await prisma.reactionRound.create({
      data: { status: 'PENDING' },
    })

    await wsBroadcast('reaction:countdown', {
      roundId: round.id,
      seconds: COUNTDOWN_SECONDS,
    })

    const activateTimer = setTimeout(async () => {
      await prisma.reactionRound.update({
        where: { id: round.id },
        data: { status: 'ACTIVE' },
      })
      await wsBroadcast('reaction:go', { roundId: round.id })
    }, COUNTDOWN_SECONDS * 1000)

    const leaderboardTimer = setTimeout(async () => {
      await finishRoundAndBroadcastLeaderboard(round.id)
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
      select: { id: true, firstName: true, username: true },
    })
    if (!user) {
      return reply.status(403).send({ error: 'User is not registered' })
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

    const place = top3.findIndex((item) => item.user.id === userId) + 1
    if (place > 0 && place <= 3) {
      await wsBroadcast('reaction:podium', {
        roundId: round.id,
        place,
        user,
      })
    }

    return {
      success: true,
      alreadyTapped: false,
      roundId: round.id,
      tapTime: tap.tapTime.toISOString(),
    }
  })
}

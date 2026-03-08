import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { validateInitData } from '../lib/telegram.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'

const BINGO_POLLS_TASK_ID = process.env.BINGO_POLLS_TASK_ID;

async function buildPollStats(pollId: string) {
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: true,
      votes: true,
    },
  })
  if (!poll) return null

  const counts: Record<string, number> = {}
  for (const option of poll.options) {
    counts[option.id] = poll.votes.filter((v) => v.optionId === option.id).length
  }

  return {
    pollId: poll.id,
    question: poll.question,
    options: poll.options.map((o) => ({ id: o.id, label: o.label })),
    counts,
    total: poll.votes.length,
  }
}

export async function pollRoutes(app: FastifyInstance) {
  app.post<{
    Body: { question: string; options: string[] }
  }>('/api/polls', async (req, reply) => {
    const { question, options } = req.body ?? ({} as any)
    if (!question || !Array.isArray(options) || options.length < 2) {
      return reply.status(400).send({ error: 'question and at least 2 options required' })
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        options: {
          create: options.map((label) => ({ label })),
        },
      },
      include: { options: true },
    })

    return poll
  })

  app.get('/api/polls', async () => {
    const polls = await prisma.poll.findMany({
      include: {
        options: true,
        votes: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return polls.map((poll) => {
      const counts: Record<string, number> = {}
      for (const option of poll.options) {
        counts[option.id] = poll.votes.filter((v) => v.optionId === option.id).length
      }
      return {
        id: poll.id,
        question: poll.question,
        options: poll.options.map((o) => ({ id: o.id, label: o.label })),
        counts,
        total: poll.votes.length,
      }
    })
  })

  app.post<{
    Params: { id: string }
    Body: { optionId: string }
  }>('/api/polls/:id/vote', async (req, reply) => {
    const initData = req.headers['x-telegram-init-data'] as string | undefined
    if (!initData) {
      return reply.status(401).send({ error: 'Missing init data' })
    }

    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    const { id: pollId } = req.params
    const { optionId } = req.body ?? ({} as any)

    if (!optionId) {
      return reply.status(400).send({ error: 'optionId required' })
    }

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    })
    if (!poll) {
      return reply.status(404).send({ error: 'Poll not found' })
    }

    if (!poll.options.some((o) => o.id === optionId)) {
      return reply.status(400).send({ error: 'Invalid optionId' })
    }

    const userId = String(tgUser.id)

    const existing = await prisma.vote.findUnique({
      where: { pollId_userId: { pollId, userId } },
    })
    if (existing) {
      return reply.status(409).send({ error: 'Already voted' })
    }

    await prisma.vote.create({
      data: { pollId, optionId, userId },
    })

    const pollCount = await prisma.poll.count()
    const userVoteCount = await prisma.vote.count({ where: { userId } })
    if (BINGO_POLLS_TASK_ID && pollCount > 0 && userVoteCount >= pollCount) {
      await completeBingoTaskForUser(BINGO_POLLS_TASK_ID, userId)
    }

    const stats = await buildPollStats(pollId)
    if (stats) {
      await wsBroadcast('poll:stats', stats, `poll:${pollId}`)
    }

    return { success: true }
  })
}

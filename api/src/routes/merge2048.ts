import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { getUserFromPrimaryAuthHeader, replyIfUserAuthMissing } from '../lib/telegram-resolve.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'

const BINGO_MERGE2048_TASK_ID = process.env.BINGO_MERGE2048_TASK_ID?.trim() ?? ''
const MERGE2048_BINGO_MIN_TILE = Number(process.env.MERGE2048_BINGO_MIN_TILE) || 512

function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0
}

function parseSessionBody(body: { maxTile?: unknown; score?: unknown }): { maxTile: number; score: number } | null {
  const rawM = body?.maxTile
  const rawS = body?.score
  const maxTile = typeof rawM === 'number' ? rawM : typeof rawM === 'string' ? Number(rawM) : NaN
  const score = typeof rawS === 'number' ? rawS : typeof rawS === 'string' ? Number(rawS) : NaN
  if (!Number.isInteger(maxTile) || maxTile < 2 || !isPowerOfTwo(maxTile)) return null
  if (!Number.isInteger(score) || score < 0) return null
  return { maxTile, score }
}

export async function merge2048Routes(app: FastifyInstance) {
  /**
   * Завершённая или брошенная партия: +1 к числу попыток, обновляем лучшие maxTile и счёт.
   * Вызывается с клиента при game over и при «Новая игра», если уже были ходы.
   */
  app.post<{
    Body: { maxTile?: unknown; score?: unknown }
  }>('/api/merge2048/session', async (req, reply) => {
    const auth = await getUserFromPrimaryAuthHeader(req.headers)
    if (!replyIfUserAuthMissing(reply, auth)) {
      return
    }
    const userId = auth.user.id
    const parsed = parseSessionBody(req.body ?? {})
    if (!parsed) {
      return reply.status(400).send({ error: 'maxTile (power of 2 ≥ 2) and score (int ≥ 0) required' })
    }
    const { maxTile, score } = parsed
    const existing = await prisma.merge2048Stats.findUnique({ where: { userId } })
    if (!existing) {
      await prisma.merge2048Stats.create({
        data: {
          userId,
          bestMaxTile: maxTile,
          bestScore: score,
          gamesPlayed: 1,
        },
      })
    } else {
      await prisma.merge2048Stats.update({
        where: { userId },
        data: {
          gamesPlayed: { increment: 1 },
          bestMaxTile: Math.max(existing.bestMaxTile, maxTile),
          bestScore: Math.max(existing.bestScore, score),
        },
      })
    }
    return { ok: true }
  })

  /** Топ игроков для слайда презентации (без авторизации). */
  app.get<{
    Querystring: { limit?: string }
  }>('/api/merge2048/leaderboard', async (req) => {
    const raw = req.query?.limit
    const n = raw === undefined ? 10 : Number(raw)
    const limit = Number.isInteger(n) ? Math.min(50, Math.max(1, n)) : 10
    const rows = await prisma.merge2048Stats.findMany({
      where: { gamesPlayed: { gt: 0 } },
      orderBy: [{ bestMaxTile: 'desc' }, { bestScore: 'desc' }],
      take: limit,
      include: {
        user: { select: { id: true, firstName: true, username: true } },
      },
    })
    return {
      items: rows.map((row, index) => ({
        place: index + 1,
        userId: row.userId,
        user: {
          firstName: row.user.firstName,
          username: row.user.username,
        },
        bestMaxTile: row.bestMaxTile,
        bestScore: row.bestScore,
        gamesPlayed: row.gamesPlayed,
      })),
    }
  })

  app.post<{
    Body: { maxTile?: unknown }
  }>('/api/merge2048/milestone', async (req, reply) => {
    const auth = await getUserFromPrimaryAuthHeader(req.headers)
    if (!replyIfUserAuthMissing(reply, auth)) {
      return
    }
    const userId = auth.user.id
    const raw = req.body?.maxTile
    const maxTile = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN
    if (!Number.isInteger(maxTile) || maxTile < 2 || !isPowerOfTwo(maxTile)) {
      return reply.status(400).send({ error: 'maxTile must be a power of two >= 2' })
    }
    if (maxTile < MERGE2048_BINGO_MIN_TILE) {
      return { success: false, reason: 'below_threshold', minTile: MERGE2048_BINGO_MIN_TILE }
    }
    if (!BINGO_MERGE2048_TASK_ID) {
      return { success: false, reason: 'not_configured' }
    }
    const result = await completeBingoTaskForUser(BINGO_MERGE2048_TASK_ID, userId)
    if (!result.ok) {
      req.log.warn(
        { taskId: BINGO_MERGE2048_TASK_ID, userId, error: result.error },
        'bingo merge2048 task not completed'
      )
      return reply.status(500).send({ error: 'Could not complete bingo task' })
    }
    return { success: true, alreadyCompleted: 'alreadyCompleted' in result && result.alreadyCompleted }
  })
}

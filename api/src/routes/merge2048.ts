import type { FastifyInstance } from 'fastify'
import { getUserFromPrimaryAuthHeader, replyIfUserAuthMissing } from '../lib/telegram-resolve.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'

const BINGO_MERGE2048_TASK_ID = process.env.BINGO_MERGE2048_TASK_ID?.trim() ?? ''
const MERGE2048_BINGO_MIN_TILE = Number(process.env.MERGE2048_BINGO_MIN_TILE) || 512

function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0
}

export async function merge2048Routes(app: FastifyInstance) {
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

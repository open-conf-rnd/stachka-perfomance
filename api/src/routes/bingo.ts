import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { requireAdmin } from '../lib/admin.js'
import { getUserFromPrimaryAuthHeader, replyIfUserAuthMissing } from '../lib/telegram-resolve.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'

const BINGO_SHARE_STORIES_TASK_ID = process.env.BINGO_SHARE_STORIES_TASK_ID
const BINGO_SHARE_CHAT_TASK_ID = process.env.BINGO_SHARE_CHAT_TASK_ID

function getInitData(headerValue: unknown): string | null {
  return typeof headerValue === 'string' && headerValue.length > 0 ? headerValue : null
}

export async function bingoRoutes(app: FastifyInstance) {
  app.post<{
    Body: { title: string; description?: string; order?: number }
  }>('/api/bingo/tasks', async (req, reply) => {
    const auth = requireAdmin(req.headers)
    if (!auth.ok) {
      return reply.status(auth.status).send(auth.body)
    }

    const { title, description, order } = req.body ?? ({} as never)
    if (!title || title.trim().length === 0) {
      return reply.status(400).send({ error: 'title is required' })
    }

    const task = await prisma.bingoTask.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        order: Number.isInteger(order) ? (order as number) : 0,
      },
    })

    return task
  })

  app.get('/api/bingo/config', async () => ({
    shareStoriesTaskId: BINGO_SHARE_STORIES_TASK_ID || null,
    shareChatTaskId: BINGO_SHARE_CHAT_TASK_ID || null,
  }))

  app.get('/api/bingo/tasks', async (req, reply) => {
    const initTg = getInitData(req.headers['x-telegram-init-data'])
    const initVk = getInitData(req.headers['x-vk-launch-params'])
    const tasks = await prisma.bingoTask.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })

    if (!initTg && !initVk) {
      return tasks
    }

    const resolved = await getUserFromPrimaryAuthHeader({
      'x-telegram-init-data': initTg ?? undefined,
      'x-vk-launch-params': initVk ?? undefined,
    })
    if (!resolved.ok && resolved.error !== 'not_registered') {
      const msg =
        resolved.error === 'missing_init' ? 'Missing init data' : 'Invalid init data'
      return reply.status(401).send({ error: msg })
    }
    const internalUserId = resolved.ok ? resolved.user.id : null
    const completions = internalUserId
      ? await prisma.bingoCompletion.findMany({
          where: { userId: internalUserId },
          select: { taskId: true },
        })
      : []
    const completed = new Set(completions.map((c: { taskId: string }) => c.taskId))

    return tasks.map((task: { id: string; [key: string]: unknown }) => ({
      ...task,
      completed: completed.has(task.id),
    }))
  })

  app.post<{
    Params: { id: string }
  }>('/api/bingo/tasks/:id/complete', async (req, reply) => {
    const auth = await getUserFromPrimaryAuthHeader(req.headers)
    if (!replyIfUserAuthMissing(reply, auth)) {
      return
    }
    const userId = auth.user.id

    const task = await prisma.bingoTask.findUnique({ where: { id: req.params.id }, select: { id: true } })
    if (!task) {
      return reply.status(404).send({ error: 'Task not found' })
    }

    const result = await completeBingoTaskForUser(task.id, userId)
    if (!result.ok) {
      if (result.error === 'USER_NOT_FOUND') {
        return reply.status(403).send({ error: 'User is not registered' })
      }
      if (result.error === 'TASK_NOT_FOUND') {
        return reply.status(404).send({ error: 'Task not found' })
      }
      return reply.status(500).send({ error: 'Cannot complete task' })
    }

    return { success: true, alreadyCompleted: result.alreadyCompleted }
  })
}

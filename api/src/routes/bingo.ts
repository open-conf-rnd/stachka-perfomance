import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { validateInitData } from '../lib/telegram.js'
import { requireAdmin } from '../lib/admin.js'
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
    const auth = requireAdmin(req.headers['x-telegram-init-data'])
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

  app.post<{
    Body: { tasks: Array<{ title: string; description?: string; order?: number }> }
  }>('/api/bingo/tasks/bulk', async (req, reply) => {
    const auth = requireAdmin(req.headers['x-telegram-init-data'])
    if (!auth.ok) {
      return reply.status(auth.status).send(auth.body)
    }

    const { tasks } = req.body ?? {}
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return reply.status(400).send({ error: 'tasks array is required' })
    }

    const created = await prisma.$transaction(
      tasks.map((t, i) =>
        prisma.bingoTask.create({
          data: {
            title: String(t?.title ?? '').trim() || `Задание ${i + 1}`,
            description: typeof t?.description === 'string' ? t.description.trim() || null : null,
            order: Number.isInteger(t?.order) ? (t.order as number) : i,
          },
        })
      )
    )

    return { created: created.length, tasks: created }
  })

  app.get('/api/bingo/config', async () => ({
    shareStoriesTaskId: BINGO_SHARE_STORIES_TASK_ID || null,
    shareChatTaskId: BINGO_SHARE_CHAT_TASK_ID || null,
  }))

  app.get('/api/bingo/tasks', async (req, reply) => {
    const initData = getInitData(req.headers['x-telegram-init-data'])
    const tasks = await prisma.bingoTask.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })

    if (!initData) {
      return tasks
    }

    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    const userId = String(tgUser.id)
    const completions = await prisma.bingoCompletion.findMany({
      where: { userId },
      select: { taskId: true },
    })
    const completed = new Set(completions.map((c) => c.taskId))

    return tasks.map((task) => ({
      ...task,
      completed: completed.has(task.id),
    }))
  })

  app.post<{
    Params: { id: string }
  }>('/api/bingo/tasks/:id/complete', async (req, reply) => {
    const initData = getInitData(req.headers['x-telegram-init-data'])
    if (!initData) {
      return reply.status(401).send({ error: 'Missing init data' })
    }

    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    const userId = String(tgUser.id)
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
    if (!user) {
      return reply.status(403).send({ error: 'User is not registered' })
    }

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

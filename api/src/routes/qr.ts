import crypto from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { validateInitData } from '../lib/telegram.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'

const BINGO_QR_TASK_ID = process.env.BINGO_QR_TASK_ID

function getInitData(headerValue: unknown): string | null {
  return typeof headerValue === 'string' && headerValue.length > 0 ? headerValue : null
}

function createQrCodeValue() {
  return crypto.randomBytes(12).toString('hex')
}

export async function qrRoutes(app: FastifyInstance) {
  app.post<{
    Body: { taskId: string; code?: string }
  }>('/api/qr/generate', async (req, reply) => {
    const { taskId, code } = req.body ?? ({} as never)
    if (!taskId) {
      return reply.status(400).send({ error: 'taskId is required' })
    }

    const task = await prisma.bingoTask.findUnique({ where: { id: taskId }, select: { id: true } })
    if (!task) {
      return reply.status(404).send({ error: 'Task not found' })
    }

    const qrCodeValue = code?.trim() || createQrCodeValue()

    const qrCode = await prisma.qrCode.create({
      data: {
        code: qrCodeValue,
        taskId: task.id,
      },
    })

    return qrCode
  })

  app.post<{
    Body: { code: string }
  }>('/api/qr/verify', async (req, reply) => {
    const initData = getInitData(req.headers['x-telegram-init-data'])
    if (!initData) {
      return reply.status(401).send({ error: 'Missing init data' })
    }

    const tgUser = validateInitData(initData)
    if (!tgUser) {
      return reply.status(401).send({ error: 'Invalid init data' })
    }

    const userId = String(tgUser.id)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return reply.status(403).send({ error: 'User is not registered' })
    }

    const code = req.body?.code?.trim()
    if (!code) {
      return reply.status(400).send({ error: 'code is required' })
    }

    const qrCode = await prisma.qrCode.findUnique({
      where: { code },
      include: { task: true },
    })
    if (!qrCode) {
      return reply.status(404).send({ error: 'Code not found' })
    }

    const completion = await completeBingoTaskForUser(qrCode.taskId, userId)
    if (!completion.ok) {
      return reply.status(500).send({ error: 'Cannot complete QR task' })
    }

    if (BINGO_QR_TASK_ID && BINGO_QR_TASK_ID !== qrCode.taskId) {
      await completeBingoTaskForUser(BINGO_QR_TASK_ID, userId)
    }

    await wsBroadcast('qr:verified', {
      code: qrCode.code,
      task: {
        id: qrCode.task.id,
        title: qrCode.task.title,
      },
      user: {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
      },
      alreadyCompleted: completion.alreadyCompleted,
    })

    return {
      success: true,
      taskId: qrCode.task.id,
      alreadyCompleted: completion.alreadyCompleted,
    }
  })
}

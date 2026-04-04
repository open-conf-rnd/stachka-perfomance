import crypto from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { sendTelegramMessage } from '../lib/telegram.js'
import {
  getTelegramChatIdForUser,
  getUserFromPrimaryAuthHeader,
  replyIfUserAuthMissing,
} from '../lib/telegram-resolve.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'

const BINGO_QR_TASK_ID = process.env.BINGO_QR_TASK_ID
const PRESENTATION_TASK_QR_CODE = 'stachka-bingo-presentation-qr'
const FEEDBACK_FORM_QR_CODE = 'stachka-feedback-form-qr'
const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf2CQmnNT05BuBYyFNd5mkKsbCLrqLNZ73Eph-neA-6UoliWQ/viewform?usp=publish-editor'

function getInitData(headerValue: unknown): string | null {
  return typeof headerValue === 'string' && headerValue.length > 0 ? headerValue : null
}

function createQrCodeValue() {
  return crypto.randomBytes(12).toString('hex')
}

export async function qrRoutes(app: FastifyInstance) {
  app.get('/api/qr/presentation', async () => ({ code: PRESENTATION_TASK_QR_CODE }))

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
    const auth = await getUserFromPrimaryAuthHeader(req.headers)
    if (!replyIfUserAuthMissing(reply, auth)) {
      return
    }
    const user = auth.user
    const userId = user.id

    const code = req.body?.code?.trim()
    if (!code) {
      return reply.status(400).send({ error: 'code is required' })
    }

    if (code === FEEDBACK_FORM_QR_CODE) {
      const chatId = await getTelegramChatIdForUser(user.id)
      if (chatId) {
        await sendTelegramMessage(
          chatId,
          [
            '<b>Спасибо, что были на докладе!</b>',
            'Буду рад вашей обратной связи.',
            `<a href="${FEEDBACK_FORM_URL}">Заполнить форму</a>`,
          ].join('\n')
        )
      }

      await wsBroadcast('qr:verified', {
        code: FEEDBACK_FORM_QR_CODE,
        task: {
          id: 'feedback-form',
          title: 'Обратная связь после доклада',
        },
        user: {
          id: user.id,
          firstName: user.firstName,
          username: user.username,
        },
        alreadyCompleted: false,
        feedbackSent: true,
      })

      return {
        success: true,
        taskId: 'feedback-form',
        alreadyCompleted: false,
        feedbackSent: true,
      }
    }

    if (code === PRESENTATION_TASK_QR_CODE) {
      if (!BINGO_QR_TASK_ID) {
        return reply.status(400).send({ error: 'BINGO_QR_TASK_ID is not configured' })
      }

      const task = await prisma.bingoTask.findUnique({
        where: { id: BINGO_QR_TASK_ID },
        select: { id: true, title: true },
      })
      if (!task) {
        return reply.status(404).send({ error: 'BINGO_QR_TASK_ID task not found' })
      }

      const completion = await completeBingoTaskForUser(task.id, userId)
      if (!completion.ok) {
        return reply.status(500).send({ error: 'Cannot complete QR task' })
      }

      await wsBroadcast('qr:verified', {
        code: PRESENTATION_TASK_QR_CODE,
        task: {
          id: task.id,
          title: task.title,
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
        taskId: task.id,
        alreadyCompleted: completion.alreadyCompleted,
      }
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

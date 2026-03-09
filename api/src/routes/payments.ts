import crypto from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { validateInitData } from '../lib/telegram.js'
import { completeBingoTaskForUser } from '../lib/bingo-progress.js'
import { wsBroadcast } from '../lib/ws-broadcast.js'

const BOT_TOKEN = process.env.TG_BOT_API || ''
const BINGO_STARS_TASK_ID = process.env.BINGO_STARS_TASK_ID
const STARS_AMOUNT = Number(process.env.TG_STARS_SUPPORT_AMOUNT || 1)
const WEBHOOK_SECRET = process.env.TG_WEBHOOK_SECRET || ''

interface TelegramSuccessfulPayment {
  telegram_payment_charge_id: string
  invoice_payload: string
  total_amount: number
  currency: string
}

interface TelegramUpdate {
  message?: {
    from?: {
      id: number
      username?: string
      first_name?: string
      last_name?: string
    }
    successful_payment?: TelegramSuccessfulPayment
  }
}

function getInitData(headerValue: unknown): string | null {
  return typeof headerValue === 'string' && headerValue.length > 0 ? headerValue : null
}

async function createInvoiceLink(params: {
  title: string
  description: string
  payload: string
  amount: number
}) {
  if (!BOT_TOKEN) {
    throw new Error('TG_BOT_API is not configured')
  }

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: params.title,
      description: params.description,
      payload: params.payload,
      provider_token: '',
      currency: 'XTR',
      prices: [{ label: params.title, amount: params.amount }],
    }),
  })

  const data = (await res.json()) as { ok: boolean; result?: string; description?: string }
  if (!data.ok || !data.result) {
    throw new Error(data.description || 'Cannot create invoice link')
  }
  return data.result
}

function getUserIdFromPayload(invoicePayload: string, fallbackUserId: string): string {
  const parts = invoicePayload.split(':')
  if (parts.length >= 2 && parts[0] === 'support' && parts[1]) {
    return parts[1]
  }
  return fallbackUserId
}

export async function paymentRoutes(app: FastifyInstance) {
  app.post('/api/payments/invoice', async (req, reply) => {
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
      select: { id: true, firstName: true },
    })
    if (!user) {
      return reply.status(403).send({ error: 'User is not registered' })
    }

    const payload = `support:${userId}:${crypto.randomUUID()}`
    const invoiceUrl = await createInvoiceLink({
      title: 'Поддержать доклад',
      description: 'Спасибо за поддержку доклада в Telegram Stars',
      payload,
      amount: STARS_AMOUNT,
    })

    return {
      invoiceUrl,
      amount: STARS_AMOUNT,
      currency: 'XTR',
    }
  })

  app.post<{ Body: TelegramUpdate }>('/api/payments/webhook', async (req, reply) => {
    if (WEBHOOK_SECRET) {
      const secret = req.headers['x-telegram-bot-api-secret-token']
      if (secret !== WEBHOOK_SECRET) {
        return reply.status(401).send({ error: 'Invalid webhook secret' })
      }
    }

    const successfulPayment = req.body?.message?.successful_payment
    if (!successfulPayment) {
      return { ok: true }
    }

    const from = req.body?.message?.from
    const fallbackUserId = from?.id ? String(from.id) : ''
    if (!fallbackUserId) {
      return reply.status(400).send({ error: 'Missing payer user id' })
    }

    const userId = getUserIdFromPayload(successfulPayment.invoice_payload, fallbackUserId)
    const telegramChargeId = successfulPayment.telegram_payment_charge_id

    const existing = await prisma.payment.findUnique({
      where: { telegramChargeId },
      select: { id: true },
    })
    if (existing) {
      return { ok: true, duplicate: true }
    }

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        username: from?.username ?? undefined,
        firstName: from?.first_name ?? undefined,
        lastName: from?.last_name ?? undefined,
      },
      create: {
        id: userId,
        username: from?.username ?? null,
        firstName: from?.first_name || 'Telegram User',
        lastName: from?.last_name ?? null,
      },
    })

    await prisma.payment.create({
      data: {
        userId: user.id,
        telegramChargeId,
        amount: successfulPayment.total_amount,
        currency: successfulPayment.currency || 'XTR',
      },
    })

    if (BINGO_STARS_TASK_ID) {
      await completeBingoTaskForUser(BINGO_STARS_TASK_ID, user.id)
    }

    await wsBroadcast('payment:success', {
      user: {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
      },
      amount: successfulPayment.total_amount,
      currency: successfulPayment.currency || 'XTR',
    })

    return { ok: true }
  })

  app.get('/api/payments/supporters', async () => {
    const grouped = await prisma.payment.groupBy({
      by: ['userId'],
      _count: { _all: true },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    })

    const users = await prisma.user.findMany({
      where: { id: { in: grouped.map((g: { userId: string }) => g.userId) } },
      select: { id: true, firstName: true, username: true },
    })

    type UserRow = { id: string; firstName: string; username: string | null }
    const usersById = new Map<string, UserRow>(users.map((u: UserRow) => [u.id, u]))
    const supporters = grouped.map((item: { userId: string; _count: { _all: number }; _sum: { amount: number | null } }) => ({
      userId: item.userId,
      firstName: usersById.get(item.userId)?.firstName ?? 'Unknown',
      username: usersById.get(item.userId)?.username ?? null,
      paymentsCount: item._count._all,
      totalAmount: item._sum.amount || 0,
      currency: 'XTR',
    }))

    const totals = await prisma.payment.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
    })

    return {
      supporters,
      totalAmount: totals._sum.amount || 0,
      totalPayments: totals._count._all,
      currency: 'XTR',
    }
  })
}

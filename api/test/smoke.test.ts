import { config } from 'dotenv'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'

config({ path: new URL('../../.env', import.meta.url).pathname })

describe('API smoke', () => {
  let app: Awaited<ReturnType<typeof createApp>>

  beforeAll(async () => {
    app = await createApp()
    await app.ready()
  })

  beforeEach(async () => {
    await prisma.reactionTap.deleteMany()
    await prisma.reactionRound.deleteMany()
    await prisma.vote.deleteMany()
    await prisma.option.deleteMany()
    await prisma.poll.deleteMany()
    await prisma.qrCode.deleteMany()
    await prisma.bingoCompletion.deleteMany()
    await prisma.bingoTask.deleteMany()
    await prisma.payment.deleteMany()
  })

  afterAll(async () => {
    await app.close()
    await prisma.$disconnect()
  })

  it('health and ready endpoints respond', async () => {
    const health = await app.inject({ method: 'GET', url: '/health' })
    expect(health.statusCode).toBe(200)
    expect(health.json()).toEqual({ status: 'ok' })

    const ready = await app.inject({ method: 'GET', url: '/ready' })
    expect(ready.statusCode).toBe(200)
    expect(ready.json()).toEqual({ ready: true })
  })

  it('poll creation and list works', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/polls',
      payload: {
        question: 'Smoke test poll?',
        options: ['Yes', 'No'],
      },
    })
    expect(created.statusCode).toBe(200)
    const poll = created.json() as { id: string }
    expect(poll.id).toBeTruthy()

    const list = await app.inject({ method: 'GET', url: '/api/polls' })
    expect(list.statusCode).toBe(200)
    const polls = list.json() as Array<{ id: string; question: string; options: unknown[] }>
    expect(polls.length).toBe(1)
    expect(polls[0]?.question).toBe('Smoke test poll?')
    expect(polls[0]?.options.length).toBe(2)
  })

  it('bingo task creation and list works', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/bingo/tasks',
      payload: { title: 'Share to story' },
    })
    expect(created.statusCode).toBe(200)

    const list = await app.inject({ method: 'GET', url: '/api/bingo/tasks' })
    expect(list.statusCode).toBe(200)
    const tasks = list.json() as Array<{ title: string }>
    expect(tasks.length).toBe(1)
    expect(tasks[0]?.title).toBe('Share to story')
  })

  it('reaction start and current endpoints respond', async () => {
    const start = await app.inject({ method: 'POST', url: '/api/reaction/start' })
    expect(start.statusCode).toBe(200)
    const started = start.json() as { roundId: string }
    expect(started.roundId).toBeTruthy()

    const current = await app.inject({ method: 'GET', url: '/api/reaction/current' })
    expect(current.statusCode).toBe(200)
    const payload = current.json() as { round: { id: string } | null }
    expect(payload.round?.id).toBeTruthy()
  })

  it('haptic trigger endpoint responds', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/haptic/trigger',
      payload: { type: 'impact', style: 'medium' },
    })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      success: true,
      payload: { type: 'impact', style: 'medium' },
    })
  })

  it('payments supporters endpoint responds', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/payments/supporters' })
    expect(response.statusCode).toBe(200)
    const payload = response.json() as { supporters: unknown[]; totalPayments: number }
    expect(Array.isArray(payload.supporters)).toBe(true)
    expect(payload.totalPayments).toBe(0)
  })
})

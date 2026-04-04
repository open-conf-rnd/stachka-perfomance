import { config } from 'dotenv'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'
import crypto from 'node:crypto'

config({ path: new URL('../../.env', import.meta.url).pathname })

describe('API smoke', () => {
  let app: Awaited<ReturnType<typeof createApp>>
  const botToken = process.env.TG_BOT_API || 'test-bot-token'

  function buildInitData(user: { id: number; first_name: string; username?: string }) {
    const authDate = Math.floor(Date.now() / 1000).toString()
    const userJson = JSON.stringify(user)
    const pairs = [
      ['auth_date', authDate],
      ['user', userJson],
    ] as const

    const dataCheckString = [...pairs]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n')

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()
    const hash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

    const params = new URLSearchParams()
    for (const [k, v] of pairs) {
      params.set(k, v)
    }
    params.set('hash', hash)
    return params.toString()
  }

  const adminInitData = () => buildInitData({ id: 999, first_name: 'Admin', username: 'admin' })

  beforeAll(async () => {
    process.env.TG_BOT_API = botToken
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
    await prisma.hapticTrigger.deleteMany()
    await prisma.user.deleteMany()
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
      headers: { 'x-telegram-init-data': adminInitData() },
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
      headers: { 'x-telegram-init-data': adminInitData() },
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
    const start = await app.inject({
      method: 'POST',
      url: '/api/reaction/start',
      headers: { 'x-telegram-init-data': adminInitData() },
    })
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
      headers: { 'x-telegram-init-data': adminInitData() },
      payload: { type: 'impact', style: 'medium' },
    })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      success: true,
      payload: { type: 'impact', style: 'medium' },
    })
  })

  it('auth register flow works with signed initData', async () => {
    const initData = buildInitData({
      id: 1001,
      first_name: 'Dima',
      username: 'dima',
    })

    const meBefore = await app.inject({
      method: 'GET',
      url: '/api/me',
      headers: { 'x-telegram-init-data': initData },
    })
    expect(meBefore.statusCode).toBe(200)
    expect(meBefore.json()).toMatchObject({ registered: false })

    const register = await app.inject({
      method: 'POST',
      url: '/api/register',
      headers: { 'x-telegram-init-data': initData },
    })
    expect(register.statusCode).toBe(200)
    expect(register.json()).toMatchObject({ registered: true, isNew: true })

    const meAfter = await app.inject({
      method: 'GET',
      url: '/api/me',
      headers: { 'x-telegram-init-data': initData },
    })
    expect(meAfter.statusCode).toBe(200)
    expect(meAfter.json()).toMatchObject({ registered: true })
  })

  it('tap and reaction tap endpoints work for registered user', async () => {
    const initData = buildInitData({
      id: 2002,
      first_name: 'Alex',
      username: 'alex',
    })

    const register = await app.inject({
      method: 'POST',
      url: '/api/register',
      headers: { 'x-telegram-init-data': initData },
    })
    expect(register.statusCode).toBe(200)

    const tap = await app.inject({
      method: 'POST',
      url: '/api/tap',
      headers: { 'x-telegram-init-data': initData },
    })
    expect(tap.statusCode).toBe(200)
    expect(tap.json()).toMatchObject({ success: true, userCount: 1 })

    const started = await app.inject({
      method: 'POST',
      url: '/api/reaction/start',
      headers: { 'x-telegram-init-data': adminInitData() },
    })
    expect(started.statusCode).toBe(200)
    const roundId = (started.json() as { roundId: string }).roundId
    expect(roundId).toBeTruthy()

    await prisma.reactionRound.updateMany({
      where: { id: roundId },
      data: { status: 'ACTIVE' },
    })

    const reactionTap = await app.inject({
      method: 'POST',
      url: '/api/reaction/tap',
      headers: { 'x-telegram-init-data': initData },
    })
    expect(reactionTap.statusCode).toBe(200)
    expect(reactionTap.json()).toMatchObject({ success: true, alreadyTapped: false, roundId })
  })
})

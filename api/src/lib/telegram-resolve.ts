import type { IncomingHttpHeaders } from 'node:http'
import type { FastifyReply } from 'fastify'
import type { User } from '../generated/prisma/client.js'
import { prisma } from './prisma.js'
import { validateInitData } from './telegram.js'
import { verifyAndParseVkLaunch } from './vk-launch.js'

export type UserAuthResult =
  | { ok: true; user: User; platform: 'telegram' | 'vk' }
  | { ok: false; error: 'missing_init' | 'invalid_init' | 'not_registered' }

export async function getUserFromTelegramInitData(
  initData: string | undefined | null
): Promise<Extract<UserAuthResult, { ok: false }> | { ok: true; user: User; platform: 'telegram' }> {
  if (typeof initData !== 'string' || initData.length === 0) {
    return { ok: false, error: 'missing_init' }
  }
  const tg = validateInitData(initData)
  if (!tg) {
    return { ok: false, error: 'invalid_init' }
  }
  const externalId = String(tg.id)
  const identity = await prisma.userIdentity.findUnique({
    where: {
      provider_externalId: {
        provider: 'telegram',
        externalId,
      },
    },
    include: { user: true },
  })
  if (!identity) {
    return { ok: false, error: 'not_registered' }
  }
  return { ok: true, user: identity.user, platform: 'telegram' }
}

export async function getUserFromVkLaunchParamsRaw(
  rawQuery: string | undefined | null
): Promise<Extract<UserAuthResult, { ok: false }> | { ok: true; user: User; platform: 'vk' }> {
  if (typeof rawQuery !== 'string' || rawQuery.length === 0) {
    return { ok: false, error: 'missing_init' }
  }
  const secret = process.env.VK_APP_SECRET ?? ''
  if (!secret) {
    return { ok: false, error: 'invalid_init' }
  }
  const appId = process.env.VK_APP_ID?.trim() || undefined
  const parsed = verifyAndParseVkLaunch(rawQuery, secret, appId)
  if (!parsed) {
    return { ok: false, error: 'invalid_init' }
  }
  const identity = await prisma.userIdentity.findUnique({
    where: {
      provider_externalId: {
        provider: 'vk',
        externalId: parsed.vkUserId,
      },
    },
    include: { user: true },
  })
  if (!identity) {
    return { ok: false, error: 'not_registered' }
  }
  return { ok: true, user: identity.user, platform: 'vk' }
}

type HeaderValue = string | string[] | undefined

function headerString(value: HeaderValue): string | undefined {
  if (typeof value === 'string' && value.length > 0) return value
  if (Array.isArray(value) && value[0]) return value[0]
  return undefined
}

/** Telegram имеет приоритет, если переданы оба заголовка (как в существующих клиентах). */
export async function getUserFromPrimaryAuthHeader(headers: IncomingHttpHeaders): Promise<UserAuthResult> {
  const tg = headerString(headers['x-telegram-init-data'])
  if (tg) {
    const r = await getUserFromTelegramInitData(tg)
    if (!r.ok) {
      return r
    }
    return { ok: true, user: r.user, platform: 'telegram' }
  }
  const vk = headerString(headers['x-vk-launch-params'])
  if (vk) {
    const r = await getUserFromVkLaunchParamsRaw(vk)
    if (!r.ok) {
      return r
    }
    return { ok: true, user: r.user, platform: 'vk' }
  }
  return { ok: false, error: 'missing_init' }
}

/** Returns false after sending the error response. */
export function replyIfUserAuthMissing(
  reply: FastifyReply,
  result: UserAuthResult
): result is { ok: true; user: User; platform: 'telegram' | 'vk' } {
  if (result.ok) {
    return true
  }
  const map = {
    missing_init: { status: 401 as const, error: 'Missing init data' },
    invalid_init: { status: 401 as const, error: 'Invalid init data' },
    not_registered: { status: 403 as const, error: 'User is not registered' },
  }[result.error]
  void reply.status(map.status).send({ error: map.error })
  return false
}

/** @deprecated use replyIfUserAuthMissing */
export const replyIfTelegramUserMissing = replyIfUserAuthMissing

export async function getTelegramChatIdForUser(userId: string): Promise<string | null> {
  const row = await prisma.userIdentity.findFirst({
    where: { userId, provider: 'telegram' },
    select: { externalId: true },
  })
  return row?.externalId ?? null
}

export async function getVkPeerIdForUser(userId: string): Promise<string | null> {
  const row = await prisma.userIdentity.findFirst({
    where: { userId, provider: 'vk' },
    select: { externalId: true },
  })
  return row?.externalId ?? null
}

import { prisma } from './prisma.js'
import type { User } from '../generated/prisma/client.js'

export type MergeTelegramVkResult =
  | { ok: true; alreadyLinked: boolean; user: User }
  | { ok: false; code: 400 | 409; error: string }

/**
 * Объединить идентичности Telegram и VK (используется в POST /api/auth/complete-account-link).
 */
export async function mergeTelegramVkIdentities(
  tgExt: string,
  vkExt: string
): Promise<MergeTelegramVkResult> {
  const [identityTg, identityVk] = await Promise.all([
    prisma.userIdentity.findUnique({
      where: { provider_externalId: { provider: 'telegram', externalId: tgExt } },
      include: { user: true },
    }),
    prisma.userIdentity.findUnique({
      where: { provider_externalId: { provider: 'vk', externalId: vkExt } },
      include: { user: true },
    }),
  ])

  if (identityTg && identityVk) {
    if (identityTg.userId === identityVk.userId) {
      return { ok: true, alreadyLinked: true, user: identityTg.user }
    }
    return {
      ok: false,
      code: 409,
      error: 'Telegram and VK are already linked to different accounts',
    }
  }

  if (identityTg && !identityVk) {
    await prisma.userIdentity.create({
      data: {
        userId: identityTg.userId,
        provider: 'vk',
        externalId: vkExt,
      },
    })
    const user = await prisma.user.findUniqueOrThrow({ where: { id: identityTg.userId } })
    return { ok: true, alreadyLinked: false, user }
  }

  if (!identityTg && identityVk) {
    await prisma.userIdentity.create({
      data: {
        userId: identityVk.userId,
        provider: 'telegram',
        externalId: tgExt,
      },
    })
    const user = await prisma.user.findUniqueOrThrow({ where: { id: identityVk.userId } })
    return { ok: true, alreadyLinked: false, user }
  }

  return {
    ok: false,
    code: 400,
    error: 'Register in the app on at least one platform first',
  }
}

import type { PrismaClient } from '../generated/prisma/client.js'

export type WipeDatabaseOptions = {
  /**
   * Не удалять `FeatureGate` (флаги доступа к страницам в админке).
   * По умолчанию false — флаги тоже сбрасываются.
   */
  keepFeatureGates?: boolean
}

/**
 * Удаляет все прикладные данные: пользователей, опросы, реакции, бинго, QR, haptic, токены привязки.
 * Схему и миграции не трогает.
 */
export async function wipeApplicationDatabase(
  prisma: PrismaClient,
  options?: WipeDatabaseOptions
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.reactionTap.deleteMany()
    await tx.reactionRound.deleteMany()
    await tx.vote.deleteMany()
    await tx.option.deleteMany()
    await tx.poll.deleteMany()
    await tx.qrCode.deleteMany()
    await tx.bingoCompletion.deleteMany()
    await tx.bingoTask.deleteMany()
    await tx.hapticTrigger.deleteMany()
    await tx.tapSessionState.deleteMany()
    await tx.user.deleteMany()
    await tx.accountLinkToken.deleteMany()
    if (!options?.keepFeatureGates) {
      await tx.featureGate.deleteMany()
    }
  })
}

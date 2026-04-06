/**
 * Полная очистка прикладных данных в БД (пользователи, опросы, реакции, бинго, QR, feature flags, …).
 *
 * Локально:  WIPE_DATABASE_CONFIRM=YES npm run wipe-database
 * Сохранить флаги доступа к страницам: WIPE_DATABASE_CONFIRM=YES WIPE_KEEP_FEATURE_GATES=1 npm run wipe-database
 *
 * Прод (образ api): docker compose ... exec api sh -c 'cd /app && WIPE_DATABASE_CONFIRM=YES node dist/scripts/wipe-database.js'
 */
import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootEnv = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../.env')
config({ path: rootEnv })
config()

async function main() {
  if (process.env.WIPE_DATABASE_CONFIRM !== 'YES') {
    // eslint-disable-next-line no-console
    console.error(
      '[wipe-database] Отказ: задайте WIPE_DATABASE_CONFIRM=YES (удалятся все пользователи и данные события).'
    )
    process.exitCode = 1
    return
  }

  const keepFeatureGates = process.env.WIPE_KEEP_FEATURE_GATES === '1'
  const { prisma } = await import('../lib/prisma.js')
  const { wipeApplicationDatabase } = await import('../lib/wipe-database.js')

  const before = {
    users: await prisma.user.count(),
    polls: await prisma.poll.count(),
    bingoTasks: await prisma.bingoTask.count(),
    reactionRounds: await prisma.reactionRound.count(),
    featureGates: await prisma.featureGate.count(),
  }
  // eslint-disable-next-line no-console
  console.log('[wipe-database] before:', before)

  await wipeApplicationDatabase(prisma, { keepFeatureGates })

  // eslint-disable-next-line no-console
  console.log(
    '[wipe-database] готово. Задания бинго удалены — при необходимости выполните npm run seed:bingo.' +
      (keepFeatureGates ? '' : ' FeatureGate очищены — включите разделы в админке заново.')
  )

  await prisma.$disconnect()
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})

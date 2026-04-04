/**
 * Удаляет всех пользователей и связанные строки (голоса, бинго, реакции, haptic, токены привязки).
 * Опросы и задания бинго не трогает.
 *
 *   npm run clear-users   (из папки api)
 */
import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootEnv = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../.env')
config({ path: rootEnv })
config()

async function main() {
  const { prisma } = await import('../lib/prisma.js')

  const before = {
    users: await prisma.user.count(),
    identities: await prisma.userIdentity.count(),
    accountLinkTokens: await prisma.accountLinkToken.count(),
    votes: await prisma.vote.count(),
    bingoCompletions: await prisma.bingoCompletion.count(),
    reactionTaps: await prisma.reactionTap.count(),
    hapticTriggers: await prisma.hapticTrigger.count(),
  }
  console.log('[clear-users] before:', before)

  await prisma.$transaction([
    prisma.reactionTap.deleteMany(),
    prisma.vote.deleteMany(),
    prisma.bingoCompletion.deleteMany(),
    prisma.hapticTrigger.deleteMany(),
    prisma.user.deleteMany(),
    prisma.accountLinkToken.deleteMany(),
  ])

  console.log(
    '[clear-users] done: users, identities (cascade), votes, bingo completions, reaction taps, haptic, account link tokens removed.'
  )

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

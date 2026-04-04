/**
 * Заполнение бинго-заданий стабильными id (одинаковые в .env и в БД после seed).
 *
 *   npx tsx src/scripts/seed-bingo-tasks.ts
 *
 * Переменная BINGO_SEED_RESET=1 — сначала удалить все BingoTask / QrCode / BingoCompletion,
 * затем создать задания заново (удобно для чистого теста).
 */
import 'dotenv/config'
import { prisma } from '../lib/prisma.js'

/** Фиксированные id: совпадают с BINGO_*_TASK_ID в .env */
const BINGO_TASKS: {
  id: string
  envKey: string
  title: string
  description: string
  order: number
}[] = [
  {
    id: 'stachka_bingo_polls',
    envKey: 'BINGO_POLLS_TASK_ID',
    title: 'Опросы',
    description: 'Проголосовать во всех опросах',
    order: 1,
  },
  {
    id: 'stachka_bingo_tap10',
    envKey: 'BINGO_TAP10_TASK_ID',
    title: 'Тап 10',
    description: 'Набрать 10 тапов в игре',
    order: 2,
  },
  {
    id: 'stachka_bingo_reaction_top3',
    envKey: 'BINGO_REACTION_TOP3_TASK_ID',
    title: 'Реакция топ-3',
    description: 'Попасть в топ-3 в раунде реакции',
    order: 3,
  },
  {
    id: 'stachka_bingo_line',
    envKey: 'BINGO_LINE_TASK_ID',
    title: 'Линия',
    description: 'Собрать линию из 3 заданий в бинго',
    order: 4,
  },
  {
    id: 'stachka_bingo_haptic',
    envKey: 'BINGO_HAPTIC_TASK_ID',
    title: 'Вибрация',
    description: 'Попробовать все типы вибрации',
    order: 5,
  },
  {
    id: 'stachka_bingo_share_stories',
    envKey: 'BINGO_SHARE_STORIES_TASK_ID',
    title: 'В сторис',
    description: 'Поделиться в сторис',
    order: 6,
  },
  {
    id: 'stachka_bingo_share_chat',
    envKey: 'BINGO_SHARE_CHAT_TASK_ID',
    title: 'В чат',
    description: 'Поделиться в чат',
    order: 7,
  },
  {
    id: 'stachka_bingo_qr',
    envKey: 'BINGO_QR_TASK_ID',
    title: 'QR-код',
    description: 'Отсканировать QR-код',
    order: 8,
  },
]

async function main() {
  if (process.env.BINGO_SEED_RESET === '1') {
    await prisma.bingoCompletion.deleteMany()
    await prisma.qrCode.deleteMany()
    await prisma.bingoTask.deleteMany()
    console.log('# BINGO_SEED_RESET=1: старые задания, QR и отметки бинго удалены.\n')
  }

  for (const { id, title, description, order, envKey } of BINGO_TASKS) {
    await prisma.bingoTask.upsert({
      where: { id },
      create: { id, title, description, order },
      update: { title, description, order },
    })
    console.log(`${envKey}=${id}`)
  }

  const extra = await prisma.bingoTask.count({
    where: { id: { notIn: BINGO_TASKS.map((t) => t.id) } },
  })
  if (extra > 0) {
    console.error(
      `\n# Внимание: в БД ещё ${extra} задание(й) с другими id — при необходимости удали вручную или запусти с BINGO_SEED_RESET=1.\n`
    )
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

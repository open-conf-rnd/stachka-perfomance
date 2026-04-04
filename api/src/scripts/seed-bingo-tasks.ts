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
    title: 'Все опросы',
    description:
      'Открой раздел с опросами и проголосуй в каждом активном опросе. Зачёт — когда по всем опросам есть твой голос.',
    order: 1,
  },
  {
    id: 'stachka_bingo_tap10',
    envKey: 'BINGO_TAP10_TASK_ID',
    title: '10 тапов',
    description:
      'В разделе «Тап» набери 10 личных нажатий — смотри на счётчик своих тапов на экране.',
    order: 2,
  },
  {
    id: 'stachka_bingo_reaction_top3',
    envKey: 'BINGO_REACTION_TOP3_TASK_ID',
    title: 'Топ-3 реакции',
    description:
      'В игре «Реакция» попади в тройку самых быстрых нажатий в одном из раундов.',
    order: 3,
  },
  {
    id: 'stachka_bingo_line',
    envKey: 'BINGO_LINE_TASK_ID',
    title: 'Линия',
    description:
      'Собери горизонталь из трёх выполненных клеток: верхний ряд сетки или средний (три карточки по центру). Отметка появится сама, когда условие выполнено.',
    order: 4,
  },
  {
    id: 'stachka_bingo_haptic',
    envKey: 'BINGO_HAPTIC_TASK_ID',
    title: 'Весь хаптик',
    description:
      'В разделе «Хаптик» один раз вызови каждый доступный паттерн: все impact (light, medium, heavy, rigid, soft) и все notification (success, warning, error).',
    order: 5,
  },
  {
    id: 'stachka_bingo_share_stories',
    envKey: 'BINGO_SHARE_STORIES_TASK_ID',
    title: 'Сторис',
    description:
      'На этой странице бинго нажми «Share to Story» и опубликуй карточку в истории Telegram.',
    order: 6,
  },
  {
    id: 'stachka_bingo_share_chat',
    envKey: 'BINGO_SHARE_CHAT_TASK_ID',
    title: 'В чат',
    description:
      'Здесь же нажми «Share в чат» и отправь сообщение с прогрессом бинго.',
    order: 7,
  },
  {
    id: 'stachka_bingo_qr',
    envKey: 'BINGO_QR_TASK_ID',
    title: 'QR доклада',
    description:
      'Отсканируй QR с экрана доклада или введи код на экране проверки — так отмечается демо-задание.',
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

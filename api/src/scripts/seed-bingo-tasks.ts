/**
 * Скрипт заполнения бинго-заданий в БД.
 * Запуск на сервере (внутри контейнера api, там уже есть POSTGRES_*):
 *   node dist/scripts/seed-bingo-tasks.js
 * Локально (из папки api, с .env или передать переменные):
 *   npx tsx src/scripts/seed-bingo-tasks.ts
 *
 * После выполнения скопируй вывод в .env.prod (BINGO_*_TASK_ID=...).
 */
import 'dotenv/config'
import { prisma } from '../lib/prisma.js'

const BINGO_TASKS: { envKey: string; title: string; description: string; order: number }[] = [
  { envKey: 'BINGO_POLLS_TASK_ID', title: 'Опросы', description: 'Проголосовать во всех опросах', order: 1 },
  { envKey: 'BINGO_TAP10_TASK_ID', title: 'Тап 10', description: 'Набрать 10 тапов в игре', order: 2 },
  { envKey: 'BINGO_REACTION_TOP3_TASK_ID', title: 'Реакция топ-3', description: 'Попасть в топ-3 в раунде реакции', order: 3 },
  { envKey: 'BINGO_LINE_TASK_ID', title: 'Линия', description: 'Собрать линию из 3 заданий в бинго', order: 4 },
  { envKey: 'BINGO_HAPTIC_TASK_ID', title: 'Вибрация', description: 'Попробовать все типы вибрации', order: 5 },
  { envKey: 'BINGO_SHARE_STORIES_TASK_ID', title: 'В сторис', description: 'Поделиться в сторис', order: 6 },
  { envKey: 'BINGO_SHARE_CHAT_TASK_ID', title: 'В чат', description: 'Поделиться в чат', order: 7 },
  { envKey: 'BINGO_QR_TASK_ID', title: 'QR-код', description: 'Отсканировать QR-код', order: 8 },
]

const ENV_KEYS_IN_ORDER = BINGO_TASKS.map((t) => t.envKey)

async function main() {
  const existing = await prisma.bingoTask.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] })

  if (existing.length >= 8) {
    console.log('# В базе уже есть задания бинго. Вывод ID по порядку (скопируй в .env):\n')
    existing.slice(0, 8).forEach((task, i) => {
      console.log(`${ENV_KEYS_IN_ORDER[i] ?? `BINGO_TASK_${i + 1}`}=${task.id}`)
    })
    await prisma.$disconnect()
    return
  }

  const created: { envKey: string; id: string }[] = []
  for (const { envKey, title, description, order } of BINGO_TASKS) {
    const task = await prisma.bingoTask.create({
      data: { title, description, order },
    })
    created.push({ envKey, id: task.id })
  }

  await prisma.$disconnect()

  console.log('# Скопируй эти строки в .env.prod (или PROD_ENV):\n')
  for (const { envKey, id } of created) {
    console.log(`${envKey}=${id}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

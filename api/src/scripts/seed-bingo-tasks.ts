/**
 * Создаёт задания бинго с фиксированными id (как в BINGO_*_TASK_ID).
 *
 * Локально: npm run seed:bingo (из папки api)
 * Прод (после build образа api): npm run seed:bingo:prod
 *
 * Сброс заданий, QR и отметок: BINGO_SEED_RESET=1
 *
 * Если BINGO_*_TASK_ID не заданы — используются значения как в .env.example.
 */
import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootEnv = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../.env')
config({ path: rootEnv })
config()

const DEFAULT_IDS = {
  polls: 'stachka_bingo_polls',
  tap10: 'stachka_bingo_tap10',
  reactionTop3: 'stachka_bingo_reaction_top3',
  line: 'stachka_bingo_line',
  haptic: 'stachka_bingo_haptic',
  shareStories: 'stachka_bingo_share_stories',
  shareChat: 'stachka_bingo_share_chat',
  qr: 'stachka_bingo_qr',
} as const

function envId(name: keyof typeof DEFAULT_IDS, envName: string): string {
  const raw = process.env[envName]?.trim()
  return raw && raw.length > 0 ? raw : DEFAULT_IDS[name]
}

type SeedRow = { id: string; title: string; description: string; order: number }

function assertDescMax100(rows: SeedRow[]) {
  for (const row of rows) {
    if (row.description.length > 100) {
      throw new Error(`Description > 100 chars for ${row.id}: ${row.description.length}`)
    }
  }
}

type ResolvedIds = { [K in keyof typeof DEFAULT_IDS]: string }

function printEnvBlock(ids: ResolvedIds) {
  const lines = [
    'BINGO_POLLS_TASK_ID=' + ids.polls,
    'BINGO_TAP10_TASK_ID=' + ids.tap10,
    'BINGO_REACTION_TOP3_TASK_ID=' + ids.reactionTop3,
    'BINGO_LINE_TASK_ID=' + ids.line,
    'BINGO_HAPTIC_TASK_ID=' + ids.haptic,
    'BINGO_SHARE_STORIES_TASK_ID=' + ids.shareStories,
    'BINGO_SHARE_CHAT_TASK_ID=' + ids.shareChat,
    'BINGO_QR_TASK_ID=' + ids.qr,
  ]
  console.log('')
  console.log('========== Скопируйте в .env / .env.prod (блок BINGO_*) ==========')
  for (const line of lines) {
    console.log(line)
  }
  console.log('================================================================')
  console.log('')
}

async function main() {
  const ids = {
    polls: envId('polls', 'BINGO_POLLS_TASK_ID'),
    tap10: envId('tap10', 'BINGO_TAP10_TASK_ID'),
    reactionTop3: envId('reactionTop3', 'BINGO_REACTION_TOP3_TASK_ID'),
    line: envId('line', 'BINGO_LINE_TASK_ID'),
    haptic: envId('haptic', 'BINGO_HAPTIC_TASK_ID'),
    shareStories: envId('shareStories', 'BINGO_SHARE_STORIES_TASK_ID'),
    shareChat: envId('shareChat', 'BINGO_SHARE_CHAT_TASK_ID'),
    qr: envId('qr', 'BINGO_QR_TASK_ID'),
  }

  const rows: SeedRow[] = [
    {
      id: ids.polls,
      title: 'Опросы',
      description: 'Проголосуй во всех опросах события — по одному ответу в каждом.',
      order: 0,
    },
    {
      id: ids.tap10,
      title: '10 тапов',
      description: 'На экране «Тап» накопи не меньше 10 суммарных тапов вместе со всеми зрителями.',
      order: 1,
    },
    {
      id: ids.reactionTop3,
      title: 'Топ-3 реакции',
      description: 'Попади в тройку самых быстрых в любом раунде игры на реакцию.',
      order: 2,
    },
    {
      id: ids.haptic,
      title: 'Хаптики',
      description: 'На экране с виброоткликами активируй все доступные типы haptic.',
      order: 3,
    },
    {
      id: ids.qr,
      title: 'QR',
      description: 'Отсканируй QR с площадки в мини-приложении и пройди проверку.',
      order: 4,
    },
    {
      id: ids.shareStories,
      title: 'Сторис',
      description: 'Нажми «Share to Story» на странице бинго и опубликуй историю.',
      order: 5,
    },
    {
      id: ids.shareChat,
      title: 'В чат',
      description: 'Нажми «Share в чат» на странице бинго и отправь приглашение.',
      order: 6,
    },
    {
      id: ids.line,
      title: 'Линия',
      description: 'Закрой любой горизонтальный ряд из трёх других заданий на карточке.',
      order: 7,
    },
  ]

  assertDescMax100(rows)

  const { prisma } = await import('../lib/prisma.js')

  if (process.env.BINGO_SEED_RESET === '1') {
    await prisma.bingoCompletion.deleteMany()
    await prisma.qrCode.deleteMany()
    await prisma.bingoTask.deleteMany()
    console.log('[seed-bingo] reset: completions, qr codes, tasks cleared')
  }

  for (const row of rows) {
    await prisma.bingoTask.upsert({
      where: { id: row.id },
      create: {
        id: row.id,
        title: row.title,
        description: row.description,
        order: row.order,
      },
      update: {
        title: row.title,
        description: row.description,
        order: row.order,
      },
    })
  }

  console.log('[seed-bingo] upserted', rows.length, 'tasks')
  printEnvBlock(ids)
  console.log(
    '[seed-bingo] Вставьте блок выше в .env, перезапустите api (и ws при необходимости), чтобы автозачёт совпадал с id в БД.'
  )

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

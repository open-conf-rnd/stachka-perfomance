import { prisma } from './prisma.js'
import { wsBroadcast } from './ws-broadcast.js'
import { sendTelegramMessage } from './telegram.js'

const BINGO_LINE_TASK_ID = process.env.BINGO_LINE_TASK_ID;

function hasBingoLine(orders: number[]): boolean {
  const set = new Set(orders)
  for (const o of set) {
    const end = o + 2
    if (end % 3 === 0 && set.has(o + 1) && set.has(end)) return true
  }
  return false
}

export async function completeBingoTaskForUser(taskId: string, userId: string) {
  const [user, task] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.bingoTask.findUnique({ where: { id: taskId } }),
  ])

  if (!user) return { ok: false as const, error: 'USER_NOT_FOUND' as const }
  if (!task) return { ok: false as const, error: 'TASK_NOT_FOUND' as const }

  const existing = await prisma.bingoCompletion.findUnique({
    where: { taskId_userId: { taskId: task.id, userId } },
  })

  if (existing) {
    return { ok: true as const, alreadyCompleted: true as const }
  }

  await prisma.bingoCompletion.create({
    data: {
      taskId: task.id,
      userId,
    },
  })

  const [completedCount, totalTasks] = await Promise.all([
    prisma.bingoCompletion.count({ where: { userId } }),
    prisma.bingoTask.count(),
  ])

  await wsBroadcast('bingo:task:completed', {
    task: {
      id: task.id,
      title: task.title,
    },
    user: {
      id: user.id,
      firstName: user.firstName,
      username: user.username,
    },
    progress: {
      completed: completedCount,
      total: totalTasks,
    },
  })

  const escapedTitle = task.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  void sendTelegramMessage(
    user.id,
    `✅ Задание выполнено: <b>${escapedTitle}</b>\nПрогресс: ${completedCount}/${totalTasks}`
  )

  if (totalTasks > 0 && completedCount === totalTasks) {
    await wsBroadcast('bingo:winner', {
      user: {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
      },
    })
    void sendTelegramMessage(
      user.id,
      '🎉 <b>Поздравляем!</b> Ты выполнил все задания бинго!'
    )
  }

  if (
    BINGO_LINE_TASK_ID &&
    taskId !== BINGO_LINE_TASK_ID &&
    !(await prisma.bingoCompletion.findUnique({
      where: { taskId_userId: { taskId: BINGO_LINE_TASK_ID, userId } },
    }))
  ) {
    const completions = await prisma.bingoCompletion.findMany({
      where: { userId },
      include: { task: { select: { order: true } } },
    })
    const orders = completions.map((c: { task: { order: number } }) => c.task.order)
    if (hasBingoLine(orders)) {
      await completeBingoTaskForUser(BINGO_LINE_TASK_ID, userId)
    }
  }

  return { ok: true as const, alreadyCompleted: false as const, completedCount, totalTasks }
}

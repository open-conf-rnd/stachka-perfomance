import { prisma } from './prisma.js'
import { wsBroadcast } from './ws-broadcast.js'
import { sendTelegramMessage } from './telegram.js'
import { getTelegramChatIdForUser, getVkPeerIdForUser } from './telegram-resolve.js'
import { sendVkUserMessage } from './vk-bot.js'

const BINGO_LINE_TASK_ID = process.env.BINGO_LINE_TASK_ID;

/** Горизонтальные линии сетки 3×N: (0,1,2), (3,4,5), (6,7,8), … */
function hasBingoLine(orders: number[]): boolean {
  const set = new Set(orders)
  for (let rowStart = 0; rowStart <= 6; rowStart += 3) {
    if (set.has(rowStart) && set.has(rowStart + 1) && set.has(rowStart + 2)) {
      return true
    }
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
  const tgChat = await getTelegramChatIdForUser(userId)
  if (tgChat) {
    void sendTelegramMessage(
      tgChat,
      `✅ Задание выполнено: <b>${escapedTitle}</b>\nПрогресс: ${completedCount}/${totalTasks}`
    )
  }
  const vkPeer = await getVkPeerIdForUser(userId)
  if (vkPeer) {
    void sendVkUserMessage(
      vkPeer,
      `✅ Задание выполнено: ${task.title}\nПрогресс: ${completedCount}/${totalTasks}`
    )
  }

  if (totalTasks > 0 && completedCount === totalTasks) {
    await wsBroadcast('bingo:winner', {
      user: {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
      },
    })
    if (tgChat) {
      void sendTelegramMessage(
        tgChat,
        '🎉 <b>Поздравляем!</b> Ты выполнил все задания бинго!'
      )
    }
    if (vkPeer) {
      void sendVkUserMessage(vkPeer, '🎉 Поздравляем! Ты выполнил все задания бинго!')
    }
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

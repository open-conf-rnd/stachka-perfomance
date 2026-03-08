import { prisma } from './prisma.js'
import { wsBroadcast } from './ws-broadcast.js'
import { sendTelegramMessage } from './telegram.js'

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

  return { ok: true as const, alreadyCompleted: false as const, completedCount, totalTasks }
}

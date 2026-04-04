import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest, apiRequestWithNotifications } from '@/shared/lib/api'
import { wsUrl } from '@/config'
import { isFeatureKey } from '@/shared/lib/featureAccess'

export interface BingoTask {
  id: string
  title: string
  description?: string | null
  completed?: boolean
}

export function useBingoPageBehavior() {
  const [tasks, setTasks] = useState<BingoTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Готово')
  const [tooltipTask, setTooltipTask] = useState<BingoTask | null>(null)
  const [shareTaskIds, setShareTaskIds] = useState<{
    shareStoriesTaskId: string | null
    shareChatTaskId: string | null
  }>({ shareStoriesTaskId: null, shareChatTaskId: null })
  const [shareEnabled, setShareEnabled] = useState(false)

  const completedCount = useMemo(
    () => tasks.filter((task) => Boolean(task.completed)).length,
    [tasks]
  )

  const loadTasks = useCallback(async () => {
    setError(null)
    try {
      const data = await apiRequest<BingoTask[]>('/api/bingo/tasks')
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить бинго')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!tooltipTask) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTooltipTask(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [tooltipTask])

  useEffect(() => {
    void apiRequest<{ shareStoriesTaskId: string | null; shareChatTaskId: string | null }>(
      '/api/bingo/config'
    )
      .then(setShareTaskIds)
      .catch(() => {})
  }, [])

  useEffect(() => {
    void apiRequest<{ enabled: string[] }>('/api/features')
      .then((data) => {
        const enabledSet = new Set(data.enabled.filter((key) => isFeatureKey(key)))
        setShareEnabled(enabledSet.has('bingoShare'))
      })
      .catch(() => {
        setShareEnabled(false)
      })
  }, [])

  useEffect(() => {
    void loadTasks()
    const ws = new WebSocket(wsUrl)
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as { type: string }
        if (msg.type === 'bingo:task:completed' || msg.type === 'bingo:winner') {
          void loadTasks()
        }
      } catch {
        // ignore malformed ws messages
      }
    }
    return () => ws.close()
  }, [loadTasks])

  const completeTaskById = async (taskId: string) => {
    setError(null)
    try {
      await apiRequestWithNotifications<{ success: boolean; alreadyCompleted: boolean }>(
        `/api/bingo/tasks/${taskId}/complete`,
        'POST',
        undefined,
        {
          popupTitle: 'Бинго',
          successMessage: 'Задание бинго отмечено как выполненное',
          errorMessage: 'Не удалось отметить задание бинго',
        }
      )
      await loadTasks()
    } catch {
      // ignore
    }
  }

  const shareToStory = async () => {
    const share = window.Telegram?.WebApp?.shareToStory
    if (!share) {
      setStatus('shareToStory недоступен в текущей среде')
      return
    }

    share('https://telegram.org/img/t_logo.png', {
      text: 'Прохожу бинго на докладе!',
      widget_link: { url: window.location.href, name: 'Открыть TMA' },
    })
    setStatus('Открыли share to story')
    if (shareTaskIds.shareStoriesTaskId) {
      await completeTaskById(shareTaskIds.shareStoriesTaskId)
    }
  }

  const shareInChat = async () => {
    const text = encodeURIComponent('Я прохожу бинго на докладе 🚀')
    const url = encodeURIComponent(window.location.href)
    const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    const openTelegramLink = window.Telegram?.WebApp?.openTelegramLink
    if (openTelegramLink) {
      openTelegramLink(shareUrl)
    } else {
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
    setStatus('Открыли share в чат')
    if (shareTaskIds.shareChatTaskId) {
      await completeTaskById(shareTaskIds.shareChatTaskId)
    }
  }

  return {
    tasks,
    loading,
    error,
    status,
    shareEnabled,
    completedCount,
    tooltipTask,
    setTooltipTask,
    shareToStory,
    shareInChat,
  }
}

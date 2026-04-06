import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '@/shared/lib/api'
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
  const [tooltipTask, setTooltipTask] = useState<BingoTask | null>(null)
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

  return {
    tasks,
    loading,
    error,
    shareEnabled,
    completedCount,
    tooltipTask,
    setTooltipTask,
  }
}

import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface BingoTask {
  id: string
  title: string
  description?: string | null
  order: number
  completed?: boolean
}

export function useBehavior() {
  const [tasks, setTasks] = useState<BingoTask[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiRequest<BingoTask[]>('/api/bingo/tasks')
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const addTask = async () => {
    if (!newTitle.trim()) {
      setError('Введите название задания')
      return
    }

    setCreating(true)
    setResult(null)
    setError(null)
    try {
      await apiRequest('/api/bingo/tasks', 'POST', {
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        order: tasks.length,
      })
      setResult('Задание добавлено')
      setNewTitle('')
      setNewDesc('')
      void loadTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать')
    } finally {
      setCreating(false)
    }
  }

  return {
    tasks,
    newTitle,
    setNewTitle,
    newDesc,
    setNewDesc,
    loading,
    creating,
    result,
    error,
    addTask,
  }
}

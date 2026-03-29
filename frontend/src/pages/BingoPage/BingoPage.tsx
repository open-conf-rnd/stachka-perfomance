import { useEffect, useMemo, useState } from 'react'
import { PageLayout } from '../../components/PageLayout'
import { apiRequest, apiRequestWithNotifications } from '../../lib/api'
import { wsUrl } from '../../config'
import { isFeatureKey } from '../../lib/featureAccess'
import './BingoPage.css'

interface BingoTask {
  id: string
  title: string
  description?: string | null
  completed?: boolean
}

export function BingoPage() {
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

  const loadTasks = async () => {
    setError(null)
    try {
      const data = await apiRequest<BingoTask[]>('/api/bingo/tasks')
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить бинго')
    } finally {
      setLoading(false)
    }
  }

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
        const enabledSet = new Set(
          data.enabled.filter((key) => isFeatureKey(key))
        )
        setShareEnabled(enabledSet.has('bingoShare'))
      })
      .catch(() => {
        setShareEnabled(false)
      })
  }, [])

  useEffect(() => {
    loadTasks()
    const ws = new WebSocket(wsUrl)
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as { type: string }
        if (msg.type === 'bingo:task:completed' || msg.type === 'bingo:winner') {
          loadTasks()
        }
      } catch {
        // ignore malformed ws messages
      }
    }
    return () => ws.close()
  }, [])

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

  return (
    <PageLayout
      title="Бинго"
      subtitle={shareEnabled ? 'Карточка заданий и Share to Story' : 'Карточка заданий'}
    >
      <p style={{ margin: '0 0 0.5rem' }}>
        Выполнено: {completedCount} / {tasks.length}
      </p>
      <p style={{ margin: '0 0 0.75rem' }}>Статус: {status}</p>

      {shareEnabled && (
        <div className="page__actions" style={{ marginTop: 0, marginBottom: '0.75rem' }}>
          <button type="button" className="btn" onClick={shareToStory}>
            Share to Story
          </button>
          <button type="button" className="btn" onClick={shareInChat}>
            Share в чат
          </button>
        </div>
      )}

      {loading ? <p className="page__loading">Загружаем задания...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {!loading && tasks.length === 0 ? <p>Заданий пока нет.</p> : null}
      {tooltipTask ? (
        <div
          className="bingo__tooltip-backdrop"
          onClick={() => setTooltipTask(null)}
          role="button"
          tabIndex={-1}
          aria-label="Закрыть"
        >
          <div
            className="bingo__tooltip"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bingo__tooltip-title">{tooltipTask.title}</div>
            <div className="bingo__tooltip-desc">{tooltipTask.description}</div>
            <button type="button" className="btn bingo__tooltip-close" onClick={() => setTooltipTask(null)}>
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
      {tasks.length > 0 ? (
        <div className="bingo__grid">
          {tasks.map((task) => {
            const completed = Boolean(task.completed)
            return (
              <div
                key={task.id}
                role="button"
                tabIndex={0}
                className={`bingo__card ${completed ? 'bingo__card--completed' : ''} ${task.description ? 'bingo__card--clickable' : ''}`}
                title={task.title}
                onClick={() => {
                  if (task.description) setTooltipTask(tooltipTask?.id === task.id ? null : task)
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && task.description) {
                    e.preventDefault()
                    setTooltipTask(tooltipTask?.id === task.id ? null : task)
                  }
                }}
              >
                <div className="bingo__card-title">{task.title}</div>
              </div>
            )
          })}
        </div>
      ) : null}
    </PageLayout>
  )
}

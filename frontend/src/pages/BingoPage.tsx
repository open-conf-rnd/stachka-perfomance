import { useEffect, useMemo, useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { apiRequest } from '../lib/api'
import { wsUrl } from '../config'

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
  const [qrCode, setQrCode] = useState('')
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null)

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

  const completeTask = async (taskId: string) => {
    setSubmittingTaskId(taskId)
    setError(null)
    try {
      const res = await apiRequest<{ success: boolean; alreadyCompleted: boolean }>(
        `/api/bingo/tasks/${taskId}/complete`,
        'POST'
      )
      setStatus(res.alreadyCompleted ? 'Задание уже было выполнено' : 'Задание выполнено')
      await loadTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отметить задание')
    } finally {
      setSubmittingTaskId(null)
    }
  }

  const completeFirstMatchingTask = async (matcher: RegExp) => {
    const target = tasks.find((task) => !task.completed && matcher.test(task.title.toLowerCase()))
    if (!target) return
    await completeTask(target.id)
  }

  const verifyQr = async () => {
    const code = qrCode.trim()
    if (!code) return
    setError(null)
    try {
      await apiRequest<{ success: boolean; alreadyCompleted: boolean }>('/api/qr/verify', 'POST', { code })
      setStatus('QR принят. Задание отмечено.')
      setQrCode('')
      await loadTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось проверить QR')
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
    await completeFirstMatchingTask(/share|истори|story/)
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
    await completeFirstMatchingTask(/share|подел|чат/)
  }

  return (
    <PageLayout title="Бинго" subtitle="Карточка заданий и Share to Story">
      <p style={{ margin: '0 0 0.5rem' }}>
        Выполнено: {completedCount} / {tasks.length}
      </p>
      <p style={{ margin: '0 0 0.75rem' }}>Статус: {status}</p>

      <div className="page__actions" style={{ marginTop: 0, marginBottom: '0.75rem' }}>
        <button type="button" className="btn" onClick={shareToStory}>
          Share to Story
        </button>
        <button type="button" className="btn" onClick={shareInChat}>
          Share в чат
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <input
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
          placeholder="Ввести QR code"
          style={{
            flex: 1,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.22)',
            background: 'rgba(255,255,255,0.08)',
            color: 'inherit',
            padding: '0.55rem 0.7rem',
          }}
        />
        <button type="button" className="btn" onClick={verifyQr}>
          Verify QR
        </button>
      </div>

      {loading ? <p className="page__loading">Загружаем задания...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {!loading && tasks.length === 0 ? <p>Заданий пока нет.</p> : null}
      {tasks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tasks.map((task) => {
            const completed = Boolean(task.completed)
            return (
              <div
                key={task.id}
                style={{
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.16)',
                  padding: '0.65rem',
                  opacity: completed ? 0.7 : 1,
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {completed ? '✅ ' : '⬜️ '}
                  {task.title}
                </div>
                {task.description ? (
                  <div style={{ fontSize: '0.88rem', opacity: 0.82, marginTop: '0.15rem' }}>
                    {task.description}
                  </div>
                ) : null}
                <div className="page__actions" style={{ marginTop: '0.55rem' }}>
                  <button
                    type="button"
                    className="btn"
                    disabled={completed || submittingTaskId === task.id}
                    onClick={() => completeTask(task.id)}
                  >
                    {completed
                      ? 'Выполнено'
                      : submittingTaskId === task.id
                        ? 'Отмечаем...'
                        : 'Отметить выполненным'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </PageLayout>
  )
}

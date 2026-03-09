import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/api'

interface BingoTask {
  id: string
  title: string
  description?: string | null
  order: number
  completed?: boolean
}

export function AdminBingoPage() {
  const [tasks, setTasks] = useState<BingoTask[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = async () => {
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
  }

  useEffect(() => {
    void loadTasks()
  }, [])

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

  return (
    <div className="admin-section">
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem' }}>Задания бинго</h2>
      {loading ? (
        <p className="page__loading">Загрузка...</p>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ margin: '0 0 0.5rem', opacity: 0.85, fontSize: '0.9rem' }}>
              Текущие задания ({tasks.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 200, overflowY: 'auto' }}>
              {tasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '0.5rem 0.65rem',
                    borderRadius: 8,
                    background: 'color-mix(in srgb, currentColor 6%, transparent)',
                    border: '1px solid color-mix(in srgb, currentColor 18%, transparent)',
                    fontSize: '0.9rem',
                  }}
                >
                  <strong>{t.title}</strong>
                  {t.description && (
                    <div style={{ opacity: 0.85, fontSize: '0.85rem' }}>{t.description}</div>
                  )}
                </div>
              ))}
              {tasks.length === 0 && <p style={{ opacity: 0.7 }}>Заданий нет</p>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Название задания"
              style={{
                padding: '0.6rem',
                borderRadius: 8,
                border: '1px solid color-mix(in srgb, currentColor 25%, transparent)',
                background: 'color-mix(in srgb, currentColor 8%, transparent)',
                color: 'inherit',
              }}
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Описание (необязательно)"
              style={{
                padding: '0.6rem',
                borderRadius: 8,
                border: '1px solid color-mix(in srgb, currentColor 25%, transparent)',
                background: 'color-mix(in srgb, currentColor 8%, transparent)',
                color: 'inherit',
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn--primary"
                disabled={creating}
                onClick={() => void addTask()}
              >
                {creating ? '...' : 'Добавить'}
              </button>
            </div>
          </div>
        </>
      )}
      {result && <p style={{ marginTop: '0.5rem', color: '#22c55e' }}>{result}</p>}
      {error && <p className="page__error">{error}</p>}
    </div>
  )
}

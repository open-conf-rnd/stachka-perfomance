import { useBehavior } from '../model'
import { AdminBingoTaskPreview } from './AdminBingoTaskPreview'

export function AdminBingoPage() {
  const {
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
  } = useBehavior()

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
                <AdminBingoTaskPreview key={t.id} title={t.title} description={t.description} />
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

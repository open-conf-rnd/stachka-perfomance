import { useState } from 'react'
import { apiRequest } from '../../lib/api'

export function AdminPollsPage() {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addOption = () => setOptions((prev) => [...prev, ''])
  const removeOption = (i: number) =>
    setOptions((prev) => (prev.length > 2 ? prev.filter((_, j) => j !== i) : prev))
  const setOption = (i: number, value: string) =>
    setOptions((prev) => prev.map((v, j) => (j === i ? value : v)))

  const submit = async () => {
    const opts = options.map((o) => o.trim()).filter(Boolean)
    if (!question.trim() || opts.length < 2) {
      setError('Вопрос и минимум 2 варианта ответа')
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const poll = await apiRequest<{ id: string; question: string }>('/api/polls', 'POST', {
        question: question.trim(),
        options: opts,
      })
      setResult(`Опрос создан: "${poll.question}"`)
      setQuestion('')
      setOptions(['', ''])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-section">
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem' }}>Создать опрос</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
            Вопрос
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Введите вопрос"
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 8,
              border: '1px solid color-mix(in srgb, currentColor 25%, transparent)',
              background: 'color-mix(in srgb, currentColor 8%, transparent)',
              color: 'inherit',
            }}
          />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <label style={{ fontSize: '0.9rem' }}>Варианты ответа</label>
            <button
              type="button"
              className="btn"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
              onClick={addOption}
            >
              + добавить
            </button>
          </div>
          {options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <input
                type="text"
                value={opt}
                onChange={(e) => setOption(i, e.target.value)}
                placeholder={`Вариант ${i + 1}`}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 8,
                  border: '1px solid color-mix(in srgb, currentColor 25%, transparent)',
                  background: 'color-mix(in srgb, currentColor 8%, transparent)',
                  color: 'inherit',
                }}
              />
              <button
                type="button"
                className="btn"
                style={{ padding: '0.5rem' }}
                disabled={options.length <= 2}
                onClick={() => removeOption(i)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn--primary"
          disabled={loading}
          onClick={() => void submit()}
        >
          {loading ? 'Создание...' : 'Создать опрос'}
        </button>
      </div>
      {result && <p style={{ marginTop: '0.75rem', color: '#22c55e' }}>{result}</p>}
      {error && <p className="page__error">{error}</p>}
    </div>
  )
}

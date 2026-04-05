import { useBehavior } from '../model'

export function AdminPollsPage() {
  const {
    question,
    setQuestion,
    options,
    correctOptionIndex,
    setCorrectOptionIndex,
    loading,
    result,
    error,
    addOption,
    removeOption,
    setOption,
    submit,
  } = useBehavior()

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
          <p style={{ margin: '0 0 0.35rem', fontSize: '0.85rem', opacity: 0.85 }}>
            Верный ответ (для слайдов презентации: зелёный / красный)
          </p>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="correct-poll-option"
              checked={correctOptionIndex === null}
              onChange={() => setCorrectOptionIndex(null)}
            />
            Не указывать (все столбцы нейтральные)
          </label>
          {options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' }}>
              <input
                type="radio"
                name="correct-poll-option"
                checked={correctOptionIndex === i}
                onChange={() => setCorrectOptionIndex(i)}
                title="Верный ответ"
                style={{ flexShrink: 0 }}
              />
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

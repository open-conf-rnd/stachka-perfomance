import { useBehavior } from '../model'

export function AdminReactionPage() {
  const { loading, result, error, startRound } = useBehavior()

  return (
    <div className="admin-section">
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem' }}>Запуск раунда на скорость</h2>
      <p style={{ margin: '0 0 1rem', opacity: 0.85, fontSize: '0.9rem' }}>
        Все участники на странице «Реакция» увидят обратный отсчёт и смогут нажать кнопку
      </p>
      <button
        type="button"
        className="btn btn--primary"
        disabled={loading}
        onClick={() => void startRound()}
      >
        {loading ? 'Запуск...' : 'Старт раунда'}
      </button>
      {result && <p style={{ marginTop: '0.75rem', color: '#22c55e' }}>{result}</p>}
      {error && <p className="page__error">{error}</p>}
    </div>
  )
}

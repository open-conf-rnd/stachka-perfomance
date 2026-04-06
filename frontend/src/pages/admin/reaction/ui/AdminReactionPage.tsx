import { useBehavior } from '../model'

export function AdminReactionPage() {
  const {
    loading,
    result,
    error,
    startRound,
    tapSessionLoading,
    tapSessionError,
    tapSessionResult,
    setTapSession,
  } = useBehavior()

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

      <hr style={{ margin: '1.5rem 0 1rem', border: 0, borderTop: '1px solid rgba(255,255,255,0.12)' }} />
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem' }}>Тапалка: окно тапов</h2>
      <p style={{ margin: '0 0 1rem', opacity: 0.85, fontSize: '0.9rem' }}>
        Пока тапы закрыты, нажатие засчитывается как фальстарт и снимает один тап с личного счёта
        участника (если он уже тапал).
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          type="button"
          className="btn btn--primary"
          disabled={tapSessionLoading}
          onClick={() => void setTapSession(true)}
        >
          {tapSessionLoading ? '…' : 'Открыть тапы'}
        </button>
        <button
          type="button"
          className="btn"
          disabled={tapSessionLoading}
          onClick={() => void setTapSession(false)}
        >
          {tapSessionLoading ? '…' : 'Закрыть тапы'}
        </button>
      </div>
      {tapSessionResult && <p style={{ marginTop: '0.75rem', color: '#22c55e' }}>{tapSessionResult}</p>}
      {tapSessionError && <p className="page__error">{tapSessionError}</p>}
    </div>
  )
}

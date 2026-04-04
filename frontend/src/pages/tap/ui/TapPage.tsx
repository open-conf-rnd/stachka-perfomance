import { PageLayout } from '@/components/PageLayout'
import { useBehavior } from '../model'

export function TapPage() {
  const { state, loading, submitting, error, goalReached, progress, onTap } = useBehavior()

  return (
    <PageLayout title="Тапалка" subtitle="Большая кнопка и счетчик до цели">
      {loading ? <p className="page__loading">Загружаем счетчики...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {state ? (
        <>
          <button
            type="button"
            className="btn"
            onClick={onTap}
            disabled={submitting}
            style={{
              width: '100%',
              minHeight: '120px',
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '0.9rem',
            }}
          >
            {submitting ? '...' : 'ТАП'}
          </button>
          <p style={{ margin: '0 0 0.4rem' }}>Твои нажатия: {state.userCount}</p>
          <p style={{ margin: '0 0 0.55rem' }}>
            Общий счетчик: {state.total} / {state.goal}
          </p>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.15)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                transition: 'width 0.2s ease',
                background: goalReached ? '#22c55e' : '#3b82f6',
              }}
            />
          </div>
          {goalReached ? (
            <p style={{ margin: '0.7rem 0 0', fontWeight: 700 }}>Цель достигнута! Показываем конфетти на слайде 🎉</p>
          ) : null}
        </>
      ) : null}
    </PageLayout>
  )
}

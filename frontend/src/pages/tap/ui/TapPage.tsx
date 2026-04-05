import { PageLayout } from '@/shared/ui/PageLayout'
import { useBehavior } from '../model'
import './TapPage.css'

export function TapPage() {
  const { state, loading, submitting, error, goalReached, progress, onTap } = useBehavior()

  return (
    <PageLayout title="Тапалка" subtitle="Тапай динозавра — копим общий счёт до цели">
      {loading ? <p className="page__loading">Загружаем счетчики...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {state ? (
        <div className="tap-page">
          <button
            type="button"
            className={`tap-dino-button${submitting ? ' tap-dino-button--busy' : ''}`}
            onClick={onTap}
            disabled={submitting}
            aria-label={submitting ? 'Отправляем тап' : 'Тап'}
          >
            <span className="tap-dino-button__emoji" aria-hidden>
              🦖
            </span>
            <span className="tap-dino-button__label">{submitting ? 'Секунду…' : 'Тап!'}</span>
          </button>
          <div className="tap-page__footer">
            <p className="tap-page__stat">Твои нажатия: {state.userCount}</p>
            <p className="tap-page__stat tap-page__stat--total">
              Общий счетчик: {state.total} / {state.goal}
            </p>
            <div className="tap-page__progress">
              <div
                className={`tap-page__progress-fill ${goalReached ? 'tap-page__progress-fill--done' : 'tap-page__progress-fill--active'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {goalReached ? (
              <p className="tap-page__goal-msg">
                Цель достигнута! Показываем конфетти на слайде 🎉
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </PageLayout>
  )
}

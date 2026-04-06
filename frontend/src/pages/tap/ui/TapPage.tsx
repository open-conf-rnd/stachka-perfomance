import { PageLayout } from '@/shared/ui/PageLayout'
import { useBehavior } from '../model'
import './TapPage.css'

export function TapPage() {
  const {
    state,
    loading,
    submitting,
    error,
    goalReached,
    progress,
    onTap,
    sessionOpen,
    falseStartMessage,
  } = useBehavior()

  const buttonDisabled = submitting || goalReached

  const buttonLabel = submitting
    ? 'Секунду…'
    : goalReached
      ? 'Готово'
      : sessionOpen
        ? 'Тап!'
        : 'Не тапай (жди сигнала)'

  return (
    <PageLayout title="Тапалка" subtitle="Тапай динозавра — копим общий счёт до цели">
      {loading ? <p className="page__loading">Загружаем счетчики...</p> : null}
      {error ? <p className="page__error">Ошибка: {error}</p> : null}
      {state ? (
        <div className="tap-page">
          {falseStartMessage ? (
            <p className="tap-page__false-start" role="alert">
              {falseStartMessage}
            </p>
          ) : null}
          {!sessionOpen && !goalReached ? (
            <p className="tap-page__session-hint">Тапы закрыты ведущим. Ранний тап — фальстарт со штрафом.</p>
          ) : null}
          <button
            type="button"
            className={`tap-dino-button${submitting ? ' tap-dino-button--busy' : ''}${!sessionOpen && !goalReached ? ' tap-dino-button--session-closed' : ''}`}
            onClick={() => void onTap()}
            disabled={buttonDisabled}
            aria-label={
              submitting
                ? 'Отправляем тап'
                : goalReached
                  ? 'Цель достигнута'
                  : sessionOpen
                    ? 'Тап'
                    : 'Тап закрыт, ранний тап будет фальстартом'
            }
          >
            <span className="tap-dino-button__emoji" aria-hidden>
              🦖
            </span>
            <span className="tap-dino-button__label">{buttonLabel}</span>
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

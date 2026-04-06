import { Link } from 'react-router-dom'
import { PageLayout } from '@/shared/ui/PageLayout'
import { useBehavior } from '../model'
import './ReactionPage.css'

/** Какой сигнал светофора горит: 0 — красный, 1 — жёлтый, 2 — зелёный */
function trafficPhase(countdown: number): 0 | 1 | 2 {
  if (countdown >= 3) return 0
  if (countdown === 2) return 1
  return 2
}

export function ReactionPage() {
  const {
    status,
    countdown,
    alreadyTapped,
    submitting,
    loading,
    error,
    canTap,
    onTap,
  } = useBehavior()

  return (
    <PageLayout title="Реакция" subtitle="">
      <div className="reaction-page">
        <div className="reaction-page__top">
          {loading ? <p className="page__loading">Загружаем состояние раунда...</p> : null}
          {error ? <p className="page__error">Ошибка: {error}</p> : null}
          <Link to="/reaction/rounds" className="btn" style={{ display: 'inline-flex' }}>
            Посмотреть результаты
          </Link>
          {countdown !== null && status === 'PENDING' ? (
            <div className="reaction-page__countdown-block">
              <div
                className="reaction-page__traffic"
                role="img"
                aria-label={`Обратный отсчёт: ${countdown} сек.`}
              >
                <div
                  className={`reaction-page__lamp reaction-page__lamp--red ${
                    trafficPhase(countdown) === 0 ? 'reaction-page__lamp--on' : ''
                  }`}
                  aria-hidden
                />
                <div
                  className={`reaction-page__lamp reaction-page__lamp--yellow ${
                    trafficPhase(countdown) === 1 ? 'reaction-page__lamp--on' : ''
                  }`}
                  aria-hidden
                />
                <div
                  className={`reaction-page__lamp reaction-page__lamp--green ${
                    trafficPhase(countdown) === 2 ? 'reaction-page__lamp--on' : ''
                  }`}
                  aria-hidden
                />
              </div>
              <p className="reaction-page__countdown-text">Старт через: {countdown}</p>
            </div>
          ) : null}
        </div>

        <button type="button" className="btn reaction-page__tap" onClick={() => void onTap()} disabled={!canTap}>
          {submitting ? '…' : canTap ? 'НАЖАТЬ' : alreadyTapped ? 'Уже нажал' : 'Ждите старта'}
        </button>

        <div className="reaction-page__after">
          {alreadyTapped ? <p style={{ margin: 0 }}>Твой результат зафиксирован.</p> : null}
        </div>
      </div>
    </PageLayout>
  )
}

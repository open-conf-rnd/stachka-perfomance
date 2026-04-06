import { Link } from 'react-router-dom'
import { PageLayout } from '@/shared/ui/PageLayout'
import { useBehavior } from '../model'
import './ReactionPage.css'

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
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Старт через: {countdown}</p>
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

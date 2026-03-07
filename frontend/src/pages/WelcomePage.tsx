import { useLocation, useNavigate } from 'react-router-dom'
import { Confetti } from '@neoconfetti/react'
import { PageLayout } from '../components/PageLayout'

export function WelcomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { celebrate?: boolean } | null
  const showConfetti = state?.celebrate ?? false

  return (
    <PageLayout title="Добро пожаловать" subtitle="Ты в Стачке!">
      {showConfetti && (
        <Confetti
          particleCount={200}
          force={0.4}
          colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']}
        />
      )}
      <div className="welcome__content">
        <div className="welcome__illustration" aria-hidden>
          📢
        </div>
        <p className="welcome__text">
          Добро пожаловать на доклад. Посмотри на экран и подключайся к активностям.
        </p>
        <button
          type="button"
          className="btn btn--primary btn--welcome"
          onClick={() => navigate('/', { replace: true })}
        >
          <span className="btn__icon">🏠</span>
          На главную
        </button>
      </div>
    </PageLayout>
  )
}

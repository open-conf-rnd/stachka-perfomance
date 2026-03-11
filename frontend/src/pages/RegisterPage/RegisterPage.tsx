import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Confetti } from '@neoconfetti/react'
import { PageLayout } from '../../components/PageLayout'
import { apiRequest, type MeResponse, type RegisterResponse } from '../../lib/api'
import './RegisterPage.css'

export function RegisterPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const me = await apiRequest<MeResponse>('/api/me')
        if (!active) return
        if (me.registered) {
          navigate('/', { replace: true })
          return
        }
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Не удалось проверить регистрацию')
      } finally {
        if (active) setChecking(false)
      }
    })()

    return () => {
      active = false
    }
  }, [navigate])

  const onRegister = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const result = await apiRequest<RegisterResponse>('/api/register', 'POST')
      setShowConfetti(true)
      setTimeout(
        () =>
          navigate(result.isNew ? '/welcome' : '/', {
            replace: true,
            state: result.isNew ? { celebrate: true } : undefined,
          }),
        800
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout title="Регистрация" subtitle="Присоединяйся к докладу">
      {checking ? (
        <div className="register__loading">
          <span className="register__spinner" aria-hidden />
          <p className="page__loading">Проверка...</p>
        </div>
      ) : (
        <div className="register__form">
          {showConfetti && (
            <Confetti
              particleCount={150}
              force={0.5}
              colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']}
            />
          )}
          <div className="register__illustration" aria-hidden>
            ✨
          </div>
          <p className="register__text">Нажми кнопку — и твоё имя появится на слайде.</p>
          {error && <p className="page__error">{error}</p>}
          <button
            type="button"
            className="btn btn--primary btn--register"
            onClick={onRegister}
            disabled={submitting}
          >
            <span className="btn__icon">🎉</span>
            {submitting ? 'Регистрируем...' : 'Зарегистрироваться'}
          </button>
        </div>
      )}
    </PageLayout>
  )
}

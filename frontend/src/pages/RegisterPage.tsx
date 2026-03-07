import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { apiRequest, type MeResponse, type RegisterResponse } from '../lib/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      navigate(result.isNew ? '/welcome' : '/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout title="Регистрация" subtitle="Кнопка регистрации и проверка /api/me">
      {checking ? (
        <p className="page__loading">Проверка статуса пользователя...</p>
      ) : (
        <>
          <p>Нажми кнопку, чтобы зарегистрироваться и показать себя на слайде.</p>
          {error && <p className="page__error">Ошибка: {error}</p>}
          <div className="page__actions">
            <button type="button" className="btn" onClick={onRegister} disabled={submitting}>
              {submitting ? 'Регистрируем...' : 'Зарегистрироваться'}
            </button>
          </div>
        </>
      )}
    </PageLayout>
  )
}

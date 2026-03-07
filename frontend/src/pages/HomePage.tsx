import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { apiRequest, type MeResponse } from '../lib/api'

const menu = [
  { path: '/bingo', title: 'Бинго', desc: 'Карточка заданий' },
  { path: '/polls', title: 'Опросы', desc: 'Голосования доклада' },
  { path: '/tap', title: 'Тапалка', desc: 'Большая кнопка и счетчик' },
  { path: '/reaction', title: 'Реакция', desc: 'Кто нажмет быстрее' },
  { path: '/haptic', title: 'Вибрации', desc: 'Демо Telegram Haptic' },
  { path: '/support', title: 'Поддержать', desc: 'Telegram Stars' },
  { path: '/welcome', title: 'Welcome', desc: 'После регистрации' },
]

export function HomePage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const me = await apiRequest<MeResponse>('/api/me')
        if (!active) return
        if (!me.registered) {
          navigate('/register', { replace: true })
          return
        }
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Не удалось проверить пользователя')
      } finally {
        if (active) setChecking(false)
      }
    })()

    return () => {
      active = false
    }
  }, [navigate])

  return (
    <PageLayout title="Stachka TMA" subtitle="Главная: все активности" enableBackButton={false}>
      {checking && <p className="page__loading">Проверка регистрации...</p>}
      {error && <p className="page__error">Ошибка: {error}</p>}
      <div className="grid">
        {menu.map((item) => (
          <Link key={item.path} to={item.path} className="grid__item">
            <span className="grid__item-title">{item.title}</span>
            <span className="grid__item-desc">{item.desc}</span>
          </Link>
        ))}
      </div>
    </PageLayout>
  )
}

import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { PageLayout } from './PageLayout'
import { apiRequest } from '@/shared/lib/api'
import { getApiAuthHeaders } from '@/shared/lib/authHeaders'

const adminMenu = [
  { path: '/admin/participants', title: 'Участники', desc: 'Рейтинг по бинго' },
  { path: '/admin/pages', title: 'Страницы', desc: 'Открыть/закрыть в меню' },
  { path: '/admin/reaction', title: 'Реакция', desc: 'Запуск раунда' },
  { path: '/admin/polls', title: 'Опросы', desc: 'Создать опрос' },
  { path: '/admin/haptic', title: 'Вибрация', desc: 'Отправить всем участникам' },
  { path: '/admin/bingo', title: 'Бинго', desc: 'Управление заданиями' },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (Object.keys(getApiAuthHeaders()).length === 0) {
      setError(
        'Нет данных авторизации. Откройте приложение из Telegram или VK Mini App, затем перейдите в админку.'
      )
      setAuthorized(false)
      setChecking(false)
      return () => {
        active = false
      }
    }

    void apiRequest<{ admin: boolean }>('/api/admin/check')
      .then((data) => {
        if (!active) return
        setAuthorized(data.admin)
        if (!data.admin) navigate('/', { replace: true })
      })
      .catch((err) => {
        if (!active) return
        const raw = err instanceof Error ? err.message : 'Доступ запрещён'
        const message =
          raw === 'Missing init data' || raw === 'Invalid init data'
            ? 'Нет данных авторизации. Откройте приложение из Telegram или VK Mini App, затем перейдите в админку.'
            : raw
        setError(message)
        setAuthorized(false)
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => {
      active = false
    }
  }, [navigate])

  if (checking) {
    return (
      <PageLayout title="Админка" subtitle="Проверка доступа..." enableBackButton={false}>
        <p className="page__loading">Загрузка...</p>
      </PageLayout>
    )
  }

  if (!authorized || error) {
    return (
      <PageLayout title="Админка" subtitle="Доступ запрещён" enableBackButton={true}>
        <p className="page__error">{error ?? 'Нет прав администратора'}</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Админ панель" subtitle="Управление активностями" enableBackButton={true}>
      <div className="grid admin-grid">
        {adminMenu.map((item) => (
          <Link key={item.path} to={item.path} className="grid__item">
            <span className="grid__item-title">{item.title}</span>
            <span className="grid__item-desc">{item.desc}</span>
          </Link>
        ))}
      </div>
      <section className="admin-outlet" style={{ marginTop: '1.25rem' }}>
        <Outlet />
      </section>
    </PageLayout>
  )
}

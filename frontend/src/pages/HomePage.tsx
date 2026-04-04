import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { apiRequest, type MeResponse } from '../lib/api'
import { featureMenuItems, isFeatureKey, type FeatureKey } from '../lib/featureAccess'

const adminItem = { path: '/admin', title: 'Админка', desc: 'Панель управления' }

export function HomePage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [enabledFeatures, setEnabledFeatures] = useState<FeatureKey[]>([])
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
        const [adminCheck, featuresResponse] = await Promise.all([
          apiRequest<{ admin: boolean }>('/api/admin/check').catch(() => ({ admin: false })),
          apiRequest<{ enabled: string[] }>('/api/features').catch(() => ({ enabled: [] })),
        ])
        if (!active) return

        setIsAdmin(adminCheck.admin)
        const allowedFeatures: FeatureKey[] = []
        for (const feature of featuresResponse.enabled) {
          if (isFeatureKey(feature)) {
            allowedFeatures.push(feature)
          }
        }
        setEnabledFeatures(allowedFeatures)
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

  const menu = featureMenuItems.filter((item) => enabledFeatures.includes(item.key))
  const visibleMenu = isAdmin ? [adminItem, ...menu] : menu

  return (
    <PageLayout title="Хобби помощник" subtitle="Главная: все активности" enableBackButton={false}>
      {checking && <p className="page__loading">Проверка регистрации...</p>}
      {error && <p className="page__error">Ошибка: {error}</p>}
      <div className="grid">
        {visibleMenu.map((item) => (
          <Link key={item.path} to={item.path} className="grid__item">
            <span className="grid__item-title">{item.title}</span>
            <span className="grid__item-desc">{item.desc}</span>
          </Link>
        ))}
      </div>
    </PageLayout>
  )
}

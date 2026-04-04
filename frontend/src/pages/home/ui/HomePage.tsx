import { PageLayout } from '@/components/PageLayout'
import { featureMenuItems } from '@/lib/featureAccess'
import { useBehavior } from '../model'
import { HomeMenuTile } from './HomeMenuTile'

const adminItem = { path: '/admin', title: 'Админка', desc: 'Панель управления' }

export function HomePage() {
  const { checking, isAdmin, enabledFeatures, error } = useBehavior()

  const menu = featureMenuItems.filter((item) => enabledFeatures.includes(item.key))
  const visibleMenu = isAdmin ? [adminItem, ...menu] : menu

  return (
    <PageLayout title="Хобби помощник" subtitle="Главная: все активности" enableBackButton={false}>
      {checking && <p className="page__loading">Проверка регистрации...</p>}
      {error && <p className="page__error">Ошибка: {error}</p>}
      <div className="grid">
        {visibleMenu.map((item) => (
          <HomeMenuTile key={item.path} path={item.path} title={item.title} desc={item.desc} />
        ))}
      </div>
    </PageLayout>
  )
}

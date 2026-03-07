import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'

export function WelcomePage() {
  const navigate = useNavigate()

  return (
    <PageLayout title="Добро пожаловать" subtitle="После регистрации показываем сообщение для зала">
      <p>Добро пожаловать на доклад. Посмотри на экран и подключайся к активностям.</p>
      <div className="page__actions">
        <button type="button" className="btn" onClick={() => navigate('/', { replace: true })}>
          На главную
        </button>
      </div>
    </PageLayout>
  )
}

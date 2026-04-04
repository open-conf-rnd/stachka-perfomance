import { PageLayout } from '@/shared/ui/PageLayout'
import { VK_MINI_APP_URL } from '@/config'
import { useBehavior } from '../model'
import '@/pages/register/ui/RegisterPage.css'

export function AccountLinkTelegramPage() {
  const { resolved, token, busy, error, done, onLink, navigate } = useBehavior()

  if (!resolved || !token) {
    return (
      <PageLayout title="Привязка" subtitle="Загрузка…" enableBackButton={false}>
        <p className="page__loading">Проверка ссылки…</p>
      </PageLayout>
    )
  }

  if (done) {
    return (
      <PageLayout title="Готово" subtitle="Аккаунты объединены" enableBackButton={false}>
        <div className="register__form">
          <section className="register__link-panel">
            <p className="register__link-steps" style={{ listStyle: 'none', paddingLeft: 0 }}>
              Теперь можно вернуться во ВКонтакте — мини-приложение увидит тот же профиль.
            </p>
            <div className="register__link-actions">
              <a
                className="btn btn--primary register__link-open"
                href={VK_MINI_APP_URL}
                target="_blank"
                rel="noreferrer"
              >
                Открыть приложение во ВКонтакте
              </a>
              <button type="button" className="btn register__btn-secondary" onClick={() => navigate('/', { replace: true })}>
                Остаться в Telegram
              </button>
            </div>
          </section>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Привязка аккаунта" subtitle="Шаг из ВКонтакте" enableBackButton={false}>
      <div className="register__form">
        {error && <p className="page__error">{error}</p>}
        <section className="register__link-panel" aria-labelledby="tg-link-title">
          <h2 id="tg-link-title" className="register__link-title">
            Связать с аккаунтом VK
          </h2>
          <p className="register__link-steps" style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '1rem' }}>
            Ты перешёл по ссылке из мини-приложения ВКонтакте. Нажми кнопку ниже — мы объединим твой
            Telegram с тем профилем VK. После этого снова открой приложение во ВКонтакте — вход будет
            с тем же аккаунтом.
          </p>
          <button
            type="button"
            className="btn btn--primary register__link-cta"
            onClick={() => void onLink()}
            disabled={busy}
          >
            {busy ? 'Связываем…' : 'Связать аккаунт'}
          </button>
        </section>
      </div>
    </PageLayout>
  )
}

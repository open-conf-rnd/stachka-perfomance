import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLaunchParams } from '@telegram-apps/sdk-react'
import { PageLayout } from '../components/PageLayout'
import { ACCOUNT_LINK_STARTAPP_PREFIX, VK_MINI_APP_URL } from '../config'
import { apiRequest } from '../lib/api'
import {
  COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY,
  PENDING_VK_LINK_TOKEN_KEY,
} from '../lib/accountLinkStorage'
import { getAppPlatform } from '../lib/authHeaders'
import './RegisterPage/RegisterPage.css'

function parseLinkToken(startParam: string | undefined): string | null {
  if (!startParam) return null
  const prefix = ACCOUNT_LINK_STARTAPP_PREFIX
  if (!startParam.startsWith(prefix) || startParam.length !== prefix.length + 32) return null
  const hex = startParam.slice(prefix.length).toLowerCase()
  return /^[a-f0-9]{32}$/.test(hex) ? hex : null
}

export function AccountLinkTelegramPage() {
  const navigate = useNavigate()
  const launchParams = useLaunchParams()
  const [token, setToken] = useState<string | null>(null)
  const [resolved, setResolved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (getAppPlatform() !== 'telegram') {
      navigate('/', { replace: true })
      return
    }
    const fromParam = parseLinkToken(launchParams.startParam)
    const stored = sessionStorage.getItem(PENDING_VK_LINK_TOKEN_KEY)
    const raw = (stored && /^[a-f0-9]{32}$/i.test(stored) ? stored.toLowerCase() : null) || fromParam
    if (!raw) {
      navigate('/', { replace: true })
      setResolved(true)
      return
    }
    sessionStorage.setItem(PENDING_VK_LINK_TOKEN_KEY, raw)
    setToken(raw)
    setResolved(true)
  }, [launchParams.startParam, navigate])

  const onLink = async () => {
    if (!token) return
    setBusy(true)
    setError(null)
    try {
      await apiRequest('/api/auth/complete-account-link', 'POST', { token })
      sessionStorage.removeItem(PENDING_VK_LINK_TOKEN_KEY)
      const sp = launchParams.startParam ?? ''
      if (sp) sessionStorage.setItem(COMPLETED_TG_ACCOUNT_LINK_STARTPARAM_KEY, sp)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось связать аккаунт')
    } finally {
      setBusy(false)
    }
  }

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

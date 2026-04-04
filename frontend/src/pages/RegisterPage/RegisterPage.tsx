import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Confetti } from '@neoconfetti/react'
import { PageLayout } from '../../components/PageLayout'
import { ACCOUNT_LINK_STARTAPP_PREFIX, TG_BOT_USERNAME } from '../../config'
import { apiRequest, type MeResponse, type RegisterResponse } from '../../lib/api'
import { getAppPlatform, type AppPlatform } from '../../lib/authHeaders'
import { copyToClipboard } from '../../lib/copyToClipboard'
import { usePlatform } from '../../hooks/usePlatform'
import './RegisterPage.css'

function alreadyHaveAccountLabel(platform: AppPlatform): string {
  switch (platform) {
    case 'vk':
      return 'У меня уже есть аккаунт в Telegram'
    case 'telegram':
      return 'У меня уже есть аккаунт во ВКонтакте'
    default:
      return 'У меня уже есть аккаунт'
  }
}

interface VkLinkTokenResponse {
  token: string
  expiresInMinutes: number
  telegramStartApp: string
}

const ACCOUNT_LINK_POLL_MS = 2500

function normalizeAccountLinkInput(raw: string): string | null {
  const t = raw.trim().replace(/\s+/g, '')
  if (!t) return null
  if (/^[a-f0-9]{32}$/i.test(t)) return t.toLowerCase()
  const p = ACCOUNT_LINK_STARTAPP_PREFIX
  if (t.length === p.length + 32 && t.toLowerCase().startsWith(p)) {
    const hex = t.slice(p.length).toLowerCase()
    return /^[a-f0-9]{32}$/.test(hex) ? hex : null
  }
  return null
}

export function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const platform = usePlatform()
  const [checking, setChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rechecking, setRechecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showLinkHelp, setShowLinkHelp] = useState(false)
  const [linkBusy, setLinkBusy] = useState(false)
  const [telegramLinkUrl, setTelegramLinkUrl] = useState<string | null>(null)
  const [manualVkLinkInput, setManualVkLinkInput] = useState('')
  const [linkWaitDeadlineMs, setLinkWaitDeadlineMs] = useState<number | null>(null)
  const [linkWaitExpired, setLinkWaitExpired] = useState(false)
  const accountLinkErrorShown = useRef(false)
  useEffect(() => {
    if (accountLinkErrorShown.current) return
    const st = location.state as { accountLinkError?: boolean } | null
    if (!st?.accountLinkError) return
    accountLinkErrorShown.current = true
    setError('Не удалось завершить привязку: неверный или просроченный код. Запроси новую ссылку.')
    navigate(`${location.pathname}${location.search}`, { replace: true, state: {} })
  }, [location.pathname, location.search, location.state, navigate])

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

  useEffect(() => {
    if (!telegramLinkUrl || linkWaitDeadlineMs === null) return

    let cancelled = false
    let intervalId: number | undefined

    const stopPolling = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId)
        intervalId = undefined
      }
    }

    const poll = async () => {
      if (cancelled) return
      if (Date.now() > linkWaitDeadlineMs) {
        setLinkWaitExpired(true)
        stopPolling()
        return
      }
      try {
        const me = await apiRequest<MeResponse>('/api/me')
        if (cancelled) return
        if (me.registered) {
          navigate('/', { replace: true })
        }
      } catch {
        // сетевые сбои — следующий тик
      }
    }

    if (Date.now() > linkWaitDeadlineMs) {
      setLinkWaitExpired(true)
    } else {
      void poll()
      intervalId = window.setInterval(() => void poll(), ACCOUNT_LINK_POLL_MS)
    }

    return () => {
      cancelled = true
      stopPolling()
    }
  }, [telegramLinkUrl, linkWaitDeadlineMs, navigate])

  const accountLinkParam = searchParams.get('account_link')
  const accountLinkToken =
    accountLinkParam && /^[a-f0-9]{32}$/i.test(accountLinkParam.trim())
      ? accountLinkParam.trim().toLowerCase()
      : null
  const showVkAccountLinkCta =
    !checking && getAppPlatform() === 'vk' && accountLinkToken !== null

  const onCompleteVkAccountLink = async () => {
    if (!accountLinkToken) return
    setLinkBusy(true)
    setError(null)
    try {
      await apiRequest('/api/auth/complete-account-link', 'POST', {
        token: accountLinkToken,
      })
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.delete('account_link')
          return next
        },
        { replace: true }
      )
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось привязать аккаунт')
    } finally {
      setLinkBusy(false)
    }
  }

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

  const onAlreadyHaveAccount = async () => {
    setRechecking(true)
    setError(null)
    setShowLinkHelp(false)
    setTelegramLinkUrl(null)
    setManualVkLinkInput('')
    setLinkWaitDeadlineMs(null)
    setLinkWaitExpired(false)
    try {
      const me = await apiRequest<MeResponse>('/api/me')
      if (me.registered) {
        navigate('/', { replace: true })
        return
      }
      const p = getAppPlatform()
      if (p === 'vk') {
        setShowLinkHelp(true)
      } else if (p === 'telegram') {
        setError(
          'Привязка к ВКонтакте делается из мини-приложения ВК: открой его и нажми «У меня уже есть аккаунт в Telegram», если нужна связка.'
        )
      } else {
        setError(
          'Открой мини-приложение из Telegram или из ВКонтакте — тогда можно привязать аккаунты или зарегистрироваться.'
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось проверить аккаунт')
    } finally {
      setRechecking(false)
    }
  }

  const onCreateVkLinkToken = async () => {
    setLinkBusy(true)
    setError(null)
    try {
      const res = await apiRequest<VkLinkTokenResponse>('/api/auth/vk-link-token', 'POST')
      const start = res.telegramStartApp
      setLinkWaitExpired(false)
      setLinkWaitDeadlineMs(Date.now() + res.expiresInMinutes * 60 * 1000)
      setTelegramLinkUrl(`https://t.me/${TG_BOT_USERNAME}?startapp=${start}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать ссылку')
    } finally {
      setLinkBusy(false)
    }
  }

  const onManualVkLinkApply = () => {
    const token = normalizeAccountLinkInput(manualVkLinkInput)
    if (!token) {
      setError('Вставь 32 символа кода или строку вида al + 32 символа (как в Telegram).')
      return
    }
    setError(null)
    navigate(`/register?account_link=${encodeURIComponent(token)}`, { replace: true })
  }

  const copyText = async (text: string) => {
    const ok = await copyToClipboard(text)
    if (!ok) {
      setError(
        'Автокопирование недоступно в этом окне — выдели ссылку долгим нажатием и скопируй вручную.'
      )
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
          {error && <p className="page__error">{error}</p>}
          {showVkAccountLinkCta && (
            <section className="register__link-panel" aria-labelledby="vk-account-link-title">
              <h2 id="vk-account-link-title" className="register__link-title">
                Завершить привязку с Telegram
              </h2>
              <p className="register__link-steps" style={{ listStyle: 'none', paddingLeft: 0 }}>
                Ты открыл ссылку из Telegram. Нажми кнопку — объединим профиль VK с аккаунтом в
                Telegram.
              </p>
              <button
                type="button"
                className="btn btn--primary register__link-cta"
                onClick={() => void onCompleteVkAccountLink()}
                disabled={submitting || rechecking || linkBusy}
              >
                {linkBusy ? 'Связываем…' : 'Связать аккаунт'}
              </button>
            </section>
          )}
          {!checking && getAppPlatform() === 'vk' && !showVkAccountLinkCta && (
            <details className="register__link-panel register__manual-code">
              <summary>Привязка из Telegram: вставить код вручную</summary>
              <p className="register__link-steps" style={{ listStyle: 'none', paddingLeft: 0 }}>
                В браузере VK для компьютера часто приходит <code>vk_ref=other</code> — ссылка с{' '}
                <code>vk.com/…?ref=…</code> не передаёт код в приложение. Скопируй{' '}
                <strong>код</strong> из Telegram (32 символа или <code>al</code>+32 символа) и
                вставь ниже.
              </p>
              <input
                type="text"
                className="register__manual-code-input"
                placeholder="например al4d6cf452f50fc9be9b8c963160a2c318"
                value={manualVkLinkInput}
                onChange={(e) => setManualVkLinkInput(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="btn btn--primary register__link-cta"
                onClick={onManualVkLinkApply}
                disabled={submitting || rechecking || linkBusy}
              >
                Продолжить привязку
              </button>
            </details>
          )}
          {showLinkHelp && platform === 'vk' && (
            <section className="register__link-panel" aria-labelledby="link-help-vk-title">
              <h2 id="link-help-vk-title" className="register__link-title">
                Привязать аккаунт Telegram
              </h2>
              <ol className="register__link-steps">
                <li>Нажми кнопку ниже — мы создадим одноразовую ссылку (действует ~15 минут).</li>
                <li>
                  Открой её <strong>в Telegram</strong> — откроется этот же бот; подтверди вход, если
                  спросит.
                </li>
                <li>
                  В мини-приложении нажми <strong>«Связать аккаунт»</strong> — только после этого
                  профили объединятся. Затем снова открой приложение во ВКонтакте.
                </li>
              </ol>
              {!telegramLinkUrl ? (
                <button
                  type="button"
                  className="btn btn--primary register__link-cta"
                  onClick={onCreateVkLinkToken}
                  disabled={submitting || rechecking || linkBusy}
                >
                  {linkBusy ? 'Готовим ссылку…' : 'Создать ссылку для Telegram'}
                </button>
              ) : (
                <div className="register__link-result">
                  <div className="register__link-url-wrap">
                    <span className="register__link-url">{telegramLinkUrl}</span>
                  </div>
                  <div className="register__link-actions">
                    <button
                      type="button"
                      className="btn register__btn-secondary"
                      onClick={() => void copyText(telegramLinkUrl)}
                    >
                      Скопировать ссылку
                    </button>
                  </div>
                  {!linkWaitExpired ? (
                    <p className="page__loading" style={{ marginTop: '0.75rem' }}>
                      Ждём подтверждения в Telegram… Можно вернуться сюда после «Связать аккаунт».
                    </p>
                  ) : (
                    <p className="page__error" style={{ marginTop: '0.75rem' }}>
                      Срок ссылки истёк. Нажми «Создать ссылку для Telegram» ещё раз.
                    </p>
                  )}
                </div>
              )}
            </section>
          )}
          <button
            type="button"
            className="btn btn--primary btn--register"
            onClick={onRegister}
            disabled={submitting || rechecking || linkBusy}
          >
            <span className="btn__icon">🎉</span>
            {submitting ? 'Регистрируем...' : 'Зарегистрироваться'}
          </button>
          <button
            type="button"
            className="btn register__btn-secondary"
            onClick={onAlreadyHaveAccount}
            disabled={submitting || rechecking || linkBusy}
          >
            {rechecking ? 'Проверяем...' : alreadyHaveAccountLabel(platform)}
          </button>
        </div>
      )}
    </PageLayout>
  )
}

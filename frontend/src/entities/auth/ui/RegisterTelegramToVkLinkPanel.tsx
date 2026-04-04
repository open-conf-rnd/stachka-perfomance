import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VK_MINI_APP_URL } from '@/config'
import { createTgLinkToken } from '@/entities/auth'
import { useAccountLinkRegistrationPoll, type RegisterLinkPanelsPageSlice } from '@/entities/auth/model'
import { RegisterLinkUrlWaitBlock } from './RegisterLinkUrlWaitBlock'

const COPY_FAIL =
  'Автокопирование недоступно в этом окне — выдели ссылку долгим нажатием и скопируй вручную.'

type Props = {
  page: RegisterLinkPanelsPageSlice
}

export function RegisterTelegramToVkLinkPanel({ page }: Props) {
  const { activity, setActivity, patchRegisterFeedback } = page
  const { submitting, rechecking, linkBusy } = activity
  const navigate = useNavigate()
  const [vkMiniAppLinkUrl, setVkMiniAppLinkUrl] = useState<string | null>(null)
  const [linkWaitDeadlineMs, setLinkWaitDeadlineMs] = useState<number | null>(null)
  const [linkWaitExpired, setLinkWaitExpired] = useState(false)

  const onWaitExpired = useCallback(() => setLinkWaitExpired(true), [])

  useAccountLinkRegistrationPoll({
    waiting: vkMiniAppLinkUrl !== null && linkWaitDeadlineMs !== null,
    deadlineMs: linkWaitDeadlineMs,
    onRegistered: () => navigate('/', { replace: true }),
    onWaitExpired,
  })

  const onCreateTgLinkToken = async () => {
    setActivity((a) => ({ ...a, linkBusy: true }))
    patchRegisterFeedback('error', null)
    try {
      const res = await createTgLinkToken()
      const base = VK_MINI_APP_URL.replace(/#.*$/, '')
      setLinkWaitExpired(false)
      setLinkWaitDeadlineMs(Date.now() + res.expiresInMinutes * 60 * 1000)
      setVkMiniAppLinkUrl(`${base}#account_link=${res.token}`)
    } catch (err) {
      patchRegisterFeedback(
        'error',
        err instanceof Error ? err.message : 'Не удалось создать ссылку'
      )
    } finally {
      setActivity((a) => ({ ...a, linkBusy: false }))
    }
  }

  const disabled = submitting || rechecking || linkBusy

  return (
    <section className="register__link-panel" aria-labelledby="link-help-tg-vk-title">
      <h2 id="link-help-tg-vk-title" className="register__link-title">
        Привязать аккаунт ВКонтакте
      </h2>
      <ol className="register__link-steps">
        <li>Нажми кнопку ниже — мы создадим одноразовую ссылку (действует ~15 минут).</li>
        <li>
          Открой её <strong>во ВКонтакте</strong> — запустится мини-приложение;
        </li>
        <li>
          Открой мини-приложение по ссылке — привязка завершится автоматически, затем снова открой бота
          в Telegram.
        </li>
      </ol>
      {!vkMiniAppLinkUrl ? (
        <button
          type="button"
          className="btn btn--primary register__link-cta"
          onClick={() => {
            onCreateTgLinkToken()
          }}
          disabled={disabled}
        >
          {linkBusy ? 'Готовим ссылку…' : 'Создать ссылку для ВКонтакте'}
        </button>
      ) : (
        <RegisterLinkUrlWaitBlock
          url={vkMiniAppLinkUrl}
          linkWaitExpired={linkWaitExpired}
          onCopyFailed={() => patchRegisterFeedback('error', COPY_FAIL)}
          waitingMessage="Ждём, пока ты откроешь ссылку во ВКонтакте и завершится привязка в мини-приложении…"
          expiredMessage="Срок ссылки истёк. Нажми «Создать ссылку для ВКонтакте» ещё раз."
        />
      )}
    </section>
  )
}

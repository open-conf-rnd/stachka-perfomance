import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TG_BOT_USERNAME } from '@/config'
import { createVkLinkToken } from '@/entities/auth'
import { useAccountLinkRegistrationPoll, type RegisterLinkPanelsPageSlice } from '@/entities/auth/model'
import { RegisterLinkUrlWaitBlock } from './RegisterLinkUrlWaitBlock'

const COPY_FAIL =
  'Автокопирование недоступно в этом окне — выдели ссылку долгим нажатием и скопируй вручную.'

type Props = {
  page: RegisterLinkPanelsPageSlice
}

export function RegisterVkToTelegramLinkPanel({ page }: Props) {
  const { activity, setActivity, patchRegisterFeedback } = page
  const { submitting, rechecking, linkBusy } = activity
  const navigate = useNavigate()
  const [telegramLinkUrl, setTelegramLinkUrl] = useState<string | null>(null)
  const [linkWaitDeadlineMs, setLinkWaitDeadlineMs] = useState<number | null>(null)
  const [linkWaitExpired, setLinkWaitExpired] = useState(false)

  const onWaitExpired = useCallback(() => setLinkWaitExpired(true), [])

  useAccountLinkRegistrationPoll({
    waiting: telegramLinkUrl !== null && linkWaitDeadlineMs !== null,
    deadlineMs: linkWaitDeadlineMs,
    onRegistered: () => navigate('/', { replace: true }),
    onWaitExpired,
  })

  const onCreateVkLinkToken = async () => {
    setActivity((a) => ({ ...a, linkBusy: true }))
    patchRegisterFeedback('error', null)
    try {
      const res = await createVkLinkToken()
      const start = res.telegramStartApp
      setLinkWaitExpired(false)
      setLinkWaitDeadlineMs(Date.now() + res.expiresInMinutes * 60 * 1000)
      setTelegramLinkUrl(`https://t.me/${TG_BOT_USERNAME}?startapp=${start}`)
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
          Открой мини-приложение по ссылке — привязка завершится автоматически, затем снова открой
          приложение во ВКонтакте.
        </li>
      </ol>
      {!telegramLinkUrl ? (
        <button
          type="button"
          className="btn btn--primary register__link-cta"
          onClick={onCreateVkLinkToken}
          disabled={disabled}
        >
          {linkBusy ? 'Готовим ссылку…' : 'Создать ссылку для Telegram'}
        </button>
      ) : (
        <RegisterLinkUrlWaitBlock
          url={telegramLinkUrl}
          linkWaitExpired={linkWaitExpired}
          onCopyFailed={() => patchRegisterFeedback('error', COPY_FAIL)}
          waitingMessage="Ждём подтверждения в Telegram… Можно вернуться сюда после «Связать аккаунт»."
          expiredMessage="Срок ссылки истёк. Нажми «Создать ссылку для Telegram» ещё раз."
        />
      )}
    </section>
  )
}

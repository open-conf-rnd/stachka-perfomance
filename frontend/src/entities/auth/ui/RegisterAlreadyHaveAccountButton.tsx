import type { Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { alreadyHaveAccountLabel, fetchMe } from '@/entities/auth'
import {
  initialRegisterAccountLinkState,
  type RegisterAccountLinkState,
  type RegisterActivityState,
  type RegisterFeedbackState,
} from '@/entities/auth/model'
import { getAppPlatform, type AppPlatform } from '@/shared/lib/authHeaders'

type Props = {
  activity: RegisterActivityState
  platform: AppPlatform
  setActivity: Dispatch<SetStateAction<RegisterActivityState>>
  setFeedback: Dispatch<SetStateAction<RegisterFeedbackState>>
  setAccountLink: Dispatch<SetStateAction<RegisterAccountLinkState>>
}

export function RegisterAlreadyHaveAccountButton({
  activity,
  platform,
  setActivity,
  setFeedback,
  setAccountLink,
}: Props) {
  const navigate = useNavigate()
  const disabled = activity.submitting || activity.rechecking || activity.linkBusy

  const onAlreadyHaveAccount = async () => {
    setActivity((a) => ({ ...a, rechecking: true }))
    setFeedback((f) => ({ ...f, error: null }))
    setAccountLink(() => ({ ...initialRegisterAccountLinkState }))
    try {
      const me = await fetchMe()
      if (me.registered) {
        navigate('/', { replace: true })
        return
      }
      const p = getAppPlatform()
      if (p === 'vk') {
        setAccountLink((s) => ({ ...s, showLinkHelp: true }))
      } else if (p === 'telegram') {
        setAccountLink((s) => ({ ...s, showTgToVkLinkHelp: true }))
      } else {
        setFeedback((f) => ({
          ...f,
          error:
            'Открой мини-приложение из Telegram или из ВКонтакте — тогда можно привязать аккаунты или зарегистрироваться.',
        }))
      }
    } catch (err) {
      setFeedback((f) => ({
        ...f,
        error: err instanceof Error ? err.message : 'Не удалось проверить аккаунт',
      }))
    } finally {
      setActivity((a) => ({ ...a, rechecking: false }))
    }
  }

  return (
    <button
      type="button"
      className="btn register__btn-secondary"
      onClick={() => void onAlreadyHaveAccount()}
      disabled={disabled}
    >
      {activity.rechecking ? 'Проверяем...' : alreadyHaveAccountLabel(platform)}
    </button>
  )
}

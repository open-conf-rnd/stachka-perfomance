import type { Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '@/entities/auth'
import type { RegisterActivityState, RegisterFeedbackState } from '@/entities/auth/model'

type Props = {
  activity: RegisterActivityState
  setActivity: Dispatch<SetStateAction<RegisterActivityState>>
  setFeedback: Dispatch<SetStateAction<RegisterFeedbackState>>
}

export function RegisterSubmitButton({ activity, setActivity, setFeedback }: Props) {
  const navigate = useNavigate()
  const disabled = activity.submitting || activity.rechecking || activity.linkBusy

  const onRegister = async () => {
    setActivity((a) => ({ ...a, submitting: true }))
    setFeedback((f) => ({ ...f, error: null }))
    try {
      const result = await registerUser()
      setFeedback((f) => ({ ...f, showConfetti: true }))
      setTimeout(
        () =>
          navigate(result.isNew ? '/welcome' : '/', {
            replace: true,
            state: result.isNew ? { celebrate: true } : undefined,
          }),
        800
      )
    } catch (err) {
      setFeedback((f) => ({
        ...f,
        error: err instanceof Error ? err.message : 'Ошибка регистрации',
      }))
    } finally {
      setActivity((a) => ({ ...a, submitting: false }))
    }
  }

  return (
    <button
      type="button"
      className="btn btn--primary btn--register"
      onClick={() => void onRegister()}
      disabled={disabled}
    >
      <span className="btn__icon">🎉</span>
      {activity.submitting ? 'Регистрируем...' : 'Зарегистрироваться'}
    </button>
  )
}

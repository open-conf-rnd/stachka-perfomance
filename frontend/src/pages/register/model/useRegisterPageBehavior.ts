import { useCallback, useMemo, useState } from 'react'
import {
  initialRegisterAccountLinkState,
  initialRegisterActivityState,
  initialRegisterFeedbackState,
  type PatchRegisterFeedback,
  type RegisterLinkPanelsPageSlice,
} from '@/entities/auth/model'
import { usePlatform } from '@/shared/lib/platform/PlatformContext'
import { useRegisterPageInitialMeCheck } from './useRegisterPageInitialMeCheck'

/** Роутинг, платформа, стейт страницы регистрации и связанные эффекты. */
export function useRegisterPageBehavior() {
  const platform = usePlatform()

  const [activity, setActivity] = useState(initialRegisterActivityState)
  const [feedback, setFeedback] = useState(initialRegisterFeedbackState)
  const [accountLink, setAccountLink] = useState(initialRegisterAccountLinkState)

  const setCheckingForInitialMe = useCallback((value: boolean) => {
    setActivity((a) => ({ ...a, checking: value }))
  }, [])

  const patchRegisterFeedback = useCallback<PatchRegisterFeedback>((key, value) => {
    setFeedback((f) => ({ ...f, [key]: value }))
  }, [])

  const linkPanelsPage = useMemo(
    () =>
      ({
        activity,
        setActivity,
        patchRegisterFeedback,
      }) satisfies RegisterLinkPanelsPageSlice,
    [activity]
  )

  useRegisterPageInitialMeCheck({
    setChecking: setCheckingForInitialMe,
    setError: (message) => patchRegisterFeedback('error', message),
  })

  return {
    platform,
    activity,
    setActivity,
    feedback,
    setFeedback,
    accountLink,
    setAccountLink,
    linkPanelsPage,
  }
}

export { useRegisterPageBehavior as useBehavior }

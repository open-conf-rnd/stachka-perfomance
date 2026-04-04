import type { Dispatch, SetStateAction } from 'react'

export type RegisterActivityState = {
  checking: boolean
  submitting: boolean
  rechecking: boolean
  linkBusy: boolean
}

export const initialRegisterActivityState: RegisterActivityState = {
  checking: true,
  submitting: false,
  rechecking: false,
  linkBusy: false,
}

export type RegisterFeedbackState = {
  error: string | null
  showConfetti: boolean
}

export const initialRegisterFeedbackState: RegisterFeedbackState = {
  error: null,
  showConfetti: false,
}

export type RegisterAccountLinkState = {
  showLinkHelp: boolean
  showTgToVkLinkHelp: boolean
}

export const initialRegisterAccountLinkState: RegisterAccountLinkState = {
  showLinkHelp: false,
  showTgToVkLinkHelp: false,
}

export type PatchRegisterFeedback = <K extends keyof RegisterFeedbackState>(
  key: K,
  value: RegisterFeedbackState[K]
) => void

/** Состояние и колбэки страницы регистрации, нужные панелям привязки VK↔Telegram. */
export type RegisterLinkPanelsPageSlice = {
  activity: RegisterActivityState
  setActivity: Dispatch<SetStateAction<RegisterActivityState>>
  patchRegisterFeedback: PatchRegisterFeedback
}

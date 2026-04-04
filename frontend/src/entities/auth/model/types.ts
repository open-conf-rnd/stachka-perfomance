export type { MeResponse, RegisterResponse } from '@/shared/lib/api'

export interface VkLinkTokenResponse {
  token: string
  expiresInMinutes: number
  telegramStartApp: string
}

export interface TgLinkTokenResponse {
  token: string
  expiresInMinutes: number
}

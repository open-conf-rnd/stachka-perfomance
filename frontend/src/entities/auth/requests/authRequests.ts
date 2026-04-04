import { apiRequest } from '@/lib/api'
import type { MeResponse, RegisterResponse, TgLinkTokenResponse, VkLinkTokenResponse } from '../model/types'

export function fetchMe(signal?: AbortSignal): Promise<MeResponse> {
  return apiRequest<MeResponse>('/api/me', 'GET', undefined, { signal })
}

export function registerUser(): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/api/register', 'POST')
}

export function createVkLinkToken(): Promise<VkLinkTokenResponse> {
  return apiRequest<VkLinkTokenResponse>('/api/auth/vk-link-token', 'POST')
}

export function createTgLinkToken(): Promise<TgLinkTokenResponse> {
  return apiRequest<TgLinkTokenResponse>('/api/auth/tg-link-token', 'POST')
}

export type CompleteAccountLinkResponse = {
  linked: boolean
  alreadyLinked?: boolean
  user: unknown
}

export function completeAccountLink(token: string): Promise<CompleteAccountLinkResponse> {
  return apiRequest<CompleteAccountLinkResponse>('/api/auth/complete-account-link', 'POST', { token })
}

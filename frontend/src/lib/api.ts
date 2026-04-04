import { apiBase } from '../config'
import { getApiAuthHeaders } from './authHeaders'
import {
  notifyTelegramResult,
  type TelegramNotificationType,
} from './telegramNotifications'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export async function apiRequest<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<T> {
  const url = apiBase ? `${apiBase}${path}` : path
  const hasBody = method !== 'GET' && body !== undefined
  const bodySerialized =
    method === 'GET' ? undefined : hasBody ? JSON.stringify(body) : '{}'

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getApiAuthHeaders(),
    },
    body: bodySerialized,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message = payload?.error || `HTTP ${response.status}`
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export interface MeResponse {
  registered: boolean
  user: {
    id: string
    username?: string | null
    firstName: string
    lastName?: string | null
    photoUrl?: string | null
  } | null
}

export interface RegisterResponse {
  registered: boolean
  isNew: boolean
  user: {
    id: string
    username?: string | null
    firstName: string
    lastName?: string | null
    photoUrl?: string | null
  }
}

interface NotificationRequestOptions {
  successType?: TelegramNotificationType
  errorType?: TelegramNotificationType
  notifyOnSuccess?: boolean
  notifyOnError?: boolean
  successCondition?: (response: unknown) => boolean
  successMessage?: string
  errorMessage?: string
  popupTitle?: string
}

export async function apiRequestWithNotifications<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown,
  options?: NotificationRequestOptions
): Promise<T> {
  try {
    const response = await apiRequest<T>(path, method, body)
    const successEnabled = options?.notifyOnSuccess !== false
    const successConditionMatched = options?.successCondition
      ? options.successCondition(response)
      : true
    if (successEnabled && successConditionMatched) {
      notifyTelegramResult(
        options?.successType ?? 'success',
        options?.successMessage ?? 'Задание бинго выполнено',
        options?.popupTitle
      )
    }
    return response
  } catch (error) {
    if (options?.notifyOnError !== false) {
      notifyTelegramResult(
        options?.errorType ?? 'error',
        options?.errorMessage ?? (error instanceof Error ? error.message : 'Не удалось выполнить задание'),
        options?.popupTitle
      )
    }
    throw error
  }
}

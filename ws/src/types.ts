/** Клиент → сервер */

export interface SubscribeMessage {
  type: 'subscribe'
  pollId: string
}

export interface VoteMessage {
  type: 'vote'
  pollId: string
  optionId: string
  question?: string
  optionIds?: string[]
  optionLabels?: Record<string, string>
}

export type ClientMessage = SubscribeMessage | VoteMessage

/** Сервер → клиенты */

export interface StatsPayload {
  pollId: string
  question: string
  optionIds: string[]
  optionLabels: Record<string, string>
  counts: Record<string, number>
  total: number
}

export interface StatsMessage {
  type: 'stats'
  payload: StatsPayload
}

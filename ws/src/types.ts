/** Клиент → сервер */

export interface SubscribeMessage {
  type: 'subscribe'
  channel?: string
  pollId?: string
}

export type ClientMessage = SubscribeMessage

/** API → WS (внутренний HTTP) */

export interface BroadcastRequest {
  type: string
  payload: unknown
  channel?: string
}

/** Сервер → клиенты */

export interface ServerMessage {
  type: string
  payload: unknown
}

import { wsUrl } from '../config'

interface WsMessage {
  type: string
  payload?: unknown
}

type WsListener = (message: WsMessage) => void

let socket: WebSocket | null = null
const listeners = new Set<WsListener>()
const channelRefCount = new Map<string, number>()
const activeChannels = new Set<string>()
let reconnectTimer: number | null = null
const RECONNECT_DELAY_MS = 1500

function clearReconnectTimer() {
  if (reconnectTimer !== null) {
    window.clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}

function shouldReconnect(): boolean {
  return listeners.size > 0
}

function scheduleReconnect() {
  if (!shouldReconnect()) return
  if (reconnectTimer !== null) return
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null
    ensureSocket()
  }, RECONNECT_DELAY_MS)
}

function ensureSocket(): WebSocket {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    return socket
  }

  clearReconnectTimer()
  socket = new WebSocket(wsUrl)
  socket.onopen = () => {
    for (const channel of channelRefCount.keys()) {
      socket?.send(JSON.stringify({ type: 'subscribe', channel }))
      activeChannels.add(channel)
    }
  }

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data) as WsMessage
      listeners.forEach((listener) => listener(message))
    } catch {
      // ignore malformed ws messages
    }
  }

  socket.onclose = () => {
    socket = null
    activeChannels.clear()
    scheduleReconnect()
  }

  return socket
}

function sendSubscribe(channel: string) {
  const ws = ensureSocket()
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'subscribe', channel }))
    activeChannels.add(channel)
  }
}

export function subscribePresentationWs(listener: WsListener): () => void {
  listeners.add(listener)
  ensureSocket()

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && socket) {
      socket.close()
      socket = null
      activeChannels.clear()
    }
    if (listeners.size === 0) {
      clearReconnectTimer()
    }
  }
}

export function subscribePresentationChannel(channel: string): () => void {
  const nextCount = (channelRefCount.get(channel) ?? 0) + 1
  channelRefCount.set(channel, nextCount)
  if (!activeChannels.has(channel)) {
    sendSubscribe(channel)
  }

  return () => {
    const current = channelRefCount.get(channel) ?? 0
    if (current <= 1) {
      channelRefCount.delete(channel)
      activeChannels.delete(channel)
      return
    }
    channelRefCount.set(channel, current - 1)
  }
}

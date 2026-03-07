import Fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import type { WebSocket } from '@fastify/websocket'
import type { ClientMessage, BroadcastRequest } from './types.js'

const STATS_WS_PORT = Number(process.env.STATS_WS_PORT) || 3001

const allClients = new Set<WebSocket>()
const channels = new Map<string, Set<WebSocket>>()

function getChannel(name: string): Set<WebSocket> {
  let set = channels.get(name)
  if (!set) {
    set = new Set()
    channels.set(name, set)
  }
  return set
}

function broadcastToAll(message: string): void {
  for (const ws of allClients) {
    if (ws.readyState === 1) ws.send(message)
  }
}

function broadcastToChannel(channel: string, message: string): void {
  const set = channels.get(channel)
  if (!set) return
  for (const ws of set) {
    if (ws.readyState === 1) ws.send(message)
  }
}

const app = Fastify({ logger: true })

await app.register(fastifyWebsocket)

app.get('/', { websocket: true }, (socket) => {
  allClients.add(socket as WebSocket)
  const clientChannels = new Set<string>()

  socket.on('message', (raw: Buffer) => {
    let msg: ClientMessage
    try {
      msg = JSON.parse(raw.toString()) as ClientMessage
    } catch {
      return
    }
    if (!msg?.type) return

    if (msg.type === 'subscribe') {
      const channel = msg.channel ?? (msg.pollId ? `poll:${msg.pollId}` : undefined)
      if (!channel) return
      getChannel(channel).add(socket as WebSocket)
      clientChannels.add(channel)
    }
  })

  socket.on('close', () => {
    allClients.delete(socket as WebSocket)
    for (const ch of clientChannels) {
      const set = channels.get(ch)
      if (set) {
        set.delete(socket as WebSocket)
        if (set.size === 0) channels.delete(ch)
      }
    }
  })
})

app.post<{ Body: BroadcastRequest }>('/internal/broadcast', async (req) => {
  const { type, payload, channel } = req.body
  const message = JSON.stringify({ type, payload })

  if (channel) {
    broadcastToChannel(channel, message)
  } else {
    broadcastToAll(message)
  }

  return { ok: true }
})

async function start() {
  try {
    await app.listen({ port: STATS_WS_PORT, host: '0.0.0.0' })
    app.log.info(`WS server on ws://0.0.0.0:${STATS_WS_PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

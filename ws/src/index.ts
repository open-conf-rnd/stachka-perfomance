import Fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import type { WebSocket } from '@fastify/websocket'
import { getOrCreatePoll, addVote, buildStatsPayload } from './store.js'
import type { ClientMessage, StatsMessage } from './types.js'

const STATS_WS_PORT = Number(process.env.STATS_WS_PORT) || 3001

const subscribers = new Map<string, Set<WebSocket>>()

function getSubscribers(pollId: string): Set<WebSocket> {
  let set = subscribers.get(pollId)
  if (!set) {
    set = new Set()
    subscribers.set(pollId, set)
  }
  return set
}

function broadcastStats(pollId: string): void {
  const payload = buildStatsPayload(pollId)
  if (!payload) return
  const message: StatsMessage = { type: 'stats', payload }
  const raw = JSON.stringify(message)
  const set = subscribers.get(pollId)
  if (!set) return
  for (const ws of set) {
    if (ws.readyState === 1) {
      ws.send(raw)
    }
  }
}

const app = Fastify({ logger: true })

await app.register(fastifyWebsocket)

app.get('/', { websocket: true }, (socket, req) => {
  const pollSubscriptions = new Set<string>()

  socket.on('message', (raw: Buffer) => {
    let msg: ClientMessage
    try {
      msg = JSON.parse(raw.toString()) as ClientMessage
    } catch {
      return
    }
    if (!msg?.type) return

    if (msg.type === 'subscribe') {
      const { pollId } = msg
      if (!pollId) return
      getSubscribers(pollId).add(socket as WebSocket)
      pollSubscriptions.add(pollId)
      getOrCreatePoll(pollId)
      const payload = buildStatsPayload(pollId)
      if (payload) {
        socket.send(JSON.stringify({ type: 'stats', payload }))
      }
      return
    }

    if (msg.type === 'vote') {
      const { pollId, optionId, question, optionIds, optionLabels } = msg
      if (!pollId || !optionId) return
      getOrCreatePoll(pollId, { question, optionIds, optionLabels })
      addVote(pollId, optionId)
      broadcastStats(pollId)
    }
  })

  socket.on('close', () => {
    for (const pollId of pollSubscriptions) {
      const set = subscribers.get(pollId)
      if (set) {
        set.delete(socket as WebSocket)
        if (set.size === 0) subscribers.delete(pollId)
      }
    }
  })
})

async function start() {
  try {
    await app.listen({ port: STATS_WS_PORT, host: '0.0.0.0' })
    app.log.info(`Stats WebSocket server on ws://0.0.0.0:${STATS_WS_PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

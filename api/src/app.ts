import Fastify from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from './routes/auth.js'
import { pollRoutes } from './routes/polls.js'
import { bingoRoutes } from './routes/bingo.js'
import { tapRoutes } from './routes/tap.js'
import { qrRoutes } from './routes/qr.js'
import { reactionRoutes } from './routes/reaction.js'
import { hapticRoutes } from './routes/haptic.js'
import { merge2048Routes } from './routes/merge2048.js'
import { adminRoutes } from './routes/admin.js'
import { displayRoutes } from './routes/display.js'
import { featureRoutes } from './routes/features.js'
import { vkCallbackRoutes } from './routes/vk-callback.js'
import { telegramWebhookRoutes } from './routes/telegram-webhook.js'

const CORS_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const

export async function createApp() {
  const app = Fastify({ logger: true })

  await app.register(cors, {
    origin: true,
    // по умолчанию в @fastify/cors только GET,HEAD,POST — без PUT preflight админки и др. падает с «CORS error»
    methods: [...CORS_METHODS],
    allowedHeaders: ['Content-Type', 'x-telegram-init-data', 'x-vk-launch-params'],
  })

  // HTTPS (VK / туннель) → http://localhost:3000: Chromium шлёт Access-Control-Request-Private-Network
  app.addHook('onSend', async (request, reply, payload) => {
    if (request.headers['access-control-request-private-network'] === 'true') {
      reply.header('Access-Control-Allow-Private-Network', 'true')
    }
    return payload
  })

  await app.register(authRoutes)
  await app.register(pollRoutes)
  await app.register(bingoRoutes)
  await app.register(tapRoutes)
  await app.register(qrRoutes)
  await app.register(reactionRoutes)
  await app.register(hapticRoutes)
  await app.register(merge2048Routes)
  await app.register(adminRoutes)
  await app.register(featureRoutes)
  await app.register(displayRoutes)
  await app.register(vkCallbackRoutes)
  await app.register(telegramWebhookRoutes)

  app.get('/health', async () => ({ status: 'ok' }))
  app.get('/ready', async () => ({ ready: true }))

  return app
}

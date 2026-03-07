import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from './routes/auth.js'
import { pollRoutes } from './routes/polls.js'
import { bingoRoutes } from './routes/bingo.js'
import { tapRoutes } from './routes/tap.js'
import { qrRoutes } from './routes/qr.js'
import { reactionRoutes } from './routes/reaction.js'
import { hapticRoutes } from './routes/haptic.js'
import { paymentRoutes } from './routes/payments.js'

const API_PORT = Number(process.env.API_PORT) || 3000

const app = Fastify({ logger: true })

await app.register(cors, { origin: true })
await app.register(authRoutes)
await app.register(pollRoutes)
await app.register(bingoRoutes)
await app.register(tapRoutes)
await app.register(qrRoutes)
await app.register(reactionRoutes)
await app.register(hapticRoutes)
await app.register(paymentRoutes)

app.get('/health', async () => ({ status: 'ok' }))
app.get('/ready', async () => ({ ready: true }))

async function start() {
  try {
    await app.listen({ port: API_PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

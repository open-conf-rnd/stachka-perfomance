import Fastify from 'fastify'

const API_PORT = Number(process.env.API_PORT) || 3000

const app = Fastify({ logger: true })

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

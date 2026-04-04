import 'dotenv/config'
import { createApp } from './app.js'

const API_PORT = Number(process.env.API_PORT) || 3000
async function start() {
  try {
    const app = await createApp()
    await app.listen({ port: API_PORT, host: '0.0.0.0' })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}

start()

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function getDomain(): string {
  if (process.env.DOMAIN) return process.env.DOMAIN
  try {
    const env = readFileSync(resolve(process.cwd(), '.env'), 'utf-8')
    const m = env.match(/^DOMAIN=(.+)$/m)
    if (m) return m[1].trim()
  } catch {
    /* no .env */
  }
  return 'localhost'
}

function showHttpsUrl() {
  return {
    name: 'show-https-url',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const domain = getDomain()
        console.log(`  ➜  HTTPS (nginx): https://${domain}/`)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), showHttpsUrl()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Разрешить запросы с кастомного домена (например udwgrosh.local), когда nginx проксирует по HTTPS
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})

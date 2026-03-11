import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

const DISPLAY_TOKEN = process.env.DISPLAY_TOKEN ?? ''

function checkDisplayAuth(token: unknown): boolean {
  if (!DISPLAY_TOKEN) return true // dev: no token required
  return typeof token === 'string' && token === DISPLAY_TOKEN
}

export async function displayRoutes(app: FastifyInstance) {
  app.get('/api/display/participants', async (req, reply) => {
    const token = (req.query as { token?: string }).token
    if (!checkDisplayAuth(token)) {
      return reply.status(401).send({ error: 'Invalid or missing display token' })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        photoUrl: true,
        _count: { select: { completions: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    return users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName ?? null,
      username: u.username ?? null,
      photoUrl: u.photoUrl ?? null,
      completionsCount: u._count.completions,
    }))
  })
}

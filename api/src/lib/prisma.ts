import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import { getDatabaseUrl } from './db-url.js'

const connectionString = getDatabaseUrl()
const adapter = new PrismaPg({ connectionString })

export const prisma = new PrismaClient({ adapter })

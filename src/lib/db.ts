import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL

  // On Cloudflare Pages (production with a PostgreSQL URL), use the Neon
  // serverless driver so that Prisma connects over HTTP/WebSocket instead
  // of raw TCP (which is unavailable in Workers).
  if (url && (url.startsWith('postgres://') || url.startsWith('postgresql://'))) {
    const pool = new Pool({ connectionString: url })
    const adapter = new PrismaNeon(pool)
    return new PrismaClient({ adapter })
  }

  // Local development — standard Prisma (e.g. SQLite file)
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()
globalForPrisma.prisma = db

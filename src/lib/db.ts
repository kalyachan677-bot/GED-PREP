import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL

  if (!url) {
    console.error('[db] DATABASE_URL is not set! Database features will not work.')
  }

  // Production: use Neon serverless driver (HTTP/WebSocket) for Vercel serverless
  if (url && (url.startsWith('postgres://') || url.startsWith('postgresql://'))) {
    try {
      const pool = new Pool({ connectionString: url })
      const adapter = new PrismaNeon(pool)
      const client = new PrismaClient({ adapter })
      console.log('[db] Using Neon serverless adapter')
      return client
    } catch (e) {
      console.error('[db] Neon adapter failed, falling back to standard Prisma:', e)
    }
  }

  // Fallback: standard Prisma connection
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()
globalForPrisma.prisma = db

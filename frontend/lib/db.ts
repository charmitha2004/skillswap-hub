import dotenv from 'dotenv'
import path from 'path'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') })

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${
    process.env.DB_HOST || 'localhost'
  }:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'skillswap'}`

const adapter = new PrismaPg({
  connectionString: databaseUrl,
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

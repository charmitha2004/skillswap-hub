import dotenv from 'dotenv'
import path from 'path'
import { defineConfig } from 'prisma/config'

dotenv.config({ path: path.resolve(process.cwd(), '..', '.env'), override: true })

const hasDbParts = process.env.DB_USER || process.env.DB_PASSWORD || process.env.DB_HOST || process.env.DB_NAME
const databaseUrl = hasDbParts
  ? `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${
      process.env.DB_HOST || 'localhost'
    }:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'skillswap'}`
  : process.env.DATABASE_URL

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
})

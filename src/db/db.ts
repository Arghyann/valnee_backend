import { drizzle } from 'drizzle-orm/postgres-js'
import  postgres  from 'postgres'
import type { Env } from '../types/env'



export const createDB = (env: Env) => {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from environment')
  }
  const connectionString = env.DATABASE_URL
  const client = postgres(connectionString, { prepare: false })
  const db = drizzle(client);
  return db
}

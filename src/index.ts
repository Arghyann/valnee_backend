import { Hono } from 'hono'
import type { Env } from './types/env.js'
import LLMroutes from './routes/LLMroutes.js'

const app = new Hono<{ Bindings: Env }>()
app.use('*', async (c, next) => {
  if (!c.env.DATABASE_URL) {
    ;(c.env as any).DATABASE_URL = process.env.DATABASE_URL
    ;(c.env as any).GEMINI_API_KEY = process.env.GEMINI_API_KEY
  }
  await next()
})
app.route('/ai', LLMroutes)

app.get('/', (c) => c.text('Valnee backend running'))

export default app

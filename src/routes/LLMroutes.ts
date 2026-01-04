import { Hono } from 'hono'
import type { Env } from '../types/env'
import { createGemini } from '../services/geminiClient'
import { createDB } from '../db/db'
import { generations } from '../db/schema'

const router = new Hono<{ Bindings: Env }>()

router.post('/generate', async (c) => {
  try {
    const { prompt, projectId } = await c.req.json()

    if (!prompt || !projectId) {
      return c.json({ error: 'prompt and projectId are required' }, 400)
    }

    const gemini = createGemini(c.env)
    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    const db = createDB(c.env)
    await db.insert(generations).values({
      projectId,
      prompt,
      response: text
    })

    return c.json({ text })
  } catch (err) {
    console.error(err)
    return c.json({ error: 'LLM generation failed' }, 500)
  }
})

router.get('/db-test', async (c) => {
  //console.log("DB url:", c.env.DATABASE_URL);    
  try {
    

    const db = createDB(c.env)
    const rows = await db.select().from(generations).limit(1)
    return c.json({ ok: true, rows })
  } catch (err) {
    console.error(err)
    return c.json({ ok: false, error: String(err) }, 500)
  }
})

export default router

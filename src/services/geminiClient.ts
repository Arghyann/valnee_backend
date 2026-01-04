import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Env } from '../types/env'

export const createGemini = (env: Env) => {
  return new GoogleGenerativeAI(env.GEMINI_API_KEY)
}

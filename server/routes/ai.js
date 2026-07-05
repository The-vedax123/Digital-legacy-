import { Router } from 'express'
import { chatLLM, isLLMEnabled, activeProvider } from '../services/llm.js'
import { echoAnswer, suggestCategory, summarizeText } from '../services/echoBrain.js'
import { buildSystemPrompt, buildContextPrompt } from '../services/prompt.js'

export const aiRouter = Router()

// POST /api/ai/chat  { message, context }
aiRouter.post('/chat', async (req, res, next) => {
  try {
    const { message, context } = req.body || {}
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' })
    }

    if (isLLMEnabled()) {
      try {
        const text = await chatLLM(buildSystemPrompt(context), buildContextPrompt(message, context))
        if (text) return res.json({ text, engine: activeProvider() })
      } catch (err) {
        console.warn('[AI] LLM failed, falling back to EchoBrain:', err.message)
      }
    }

    return res.json({ ...echoAnswer(message, context), engine: 'echo-brain' })
  } catch (err) {
    next(err)
  }
})

// POST /api/ai/categorize  { title }
aiRouter.post('/categorize', async (req, res, next) => {
  try {
    const { title } = req.body || {}
    if (isLLMEnabled() && title) {
      try {
        const text = await chatLLM(
          'You classify documents into exactly one of: Passport, National ID, Insurance, Property Documents, Business Documents, Certificates, Medical Records, Crypto Information, Personal Documents. Reply with ONLY the category name, nothing else.',
          `Document title: "${title}"`,
        )
        const clean = (text || '').split('\n')[0].trim()
        if (clean) return res.json({ category: clean, engine: activeProvider() })
      } catch (err) {
        console.warn('[AI] categorize fallback:', err.message)
      }
    }
    return res.json({ category: suggestCategory(title), engine: 'echo-brain' })
  } catch (err) {
    next(err)
  }
})

// POST /api/ai/summarize  { title, description, type }
aiRouter.post('/summarize', async (req, res, next) => {
  try {
    const { title, description, type } = req.body || {}
    if (isLLMEnabled() && (title || description)) {
      try {
        const text = await chatLLM(
          'You write a single warm, heartfelt sentence (max 25 words) summarizing a personal memory for a digital legacy vault. Reply with only the sentence.',
          `Title: ${title}\nDescription: ${description}\nType: ${type}`,
        )
        const clean = (text || '').split('\n')[0].trim()
        if (clean) return res.json({ summary: clean, engine: activeProvider() })
      } catch (err) {
        console.warn('[AI] summarize fallback:', err.message)
      }
    }
    return res.json({ summary: summarizeText(title, description, type), engine: 'echo-brain' })
  } catch (err) {
    next(err)
  }
})

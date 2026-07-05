import { Router } from 'express'
import { callGemini, isGeminiEnabled } from '../services/gemini.js'
import { echoAnswer, suggestCategory, summarizeText } from '../services/echoBrain.js'

export const aiRouter = Router()

const buildSystemPrompt = () =>
  `You are "Echo", the warm, trustworthy AI assistant inside EchoVault — a secure Digital Legacy Platform.
People use EchoVault to preserve documents, memories, and wishes so their loved ones are never left in the dark.
Answer naturally and concisely. Be emotionally intelligent, reassuring and practical.
When the user asks about their documents, memories, contacts or time capsules, use ONLY the JSON context provided.
If something is missing, gently suggest how they can add it. Never invent documents that are not in the context.
Format lists with bullet points. Keep answers under ~180 words.`

const buildContextPrompt = (question, context) => {
  const safe = {
    documents: (context?.documents || []).map((d) => ({
      title: d.title,
      category: d.category,
      description: d.description,
      importance: d.importance,
      beneficiary: d.beneficiary,
      expiryDate: d.expiryDate,
    })),
    memories: (context?.memories || []).map((m) => ({ title: m.title, type: m.type, summary: m.summary })),
    contacts: (context?.contacts || []).map((c) => ({ name: c.name, relationship: c.relationship, permission: c.permission })),
    capsules: (context?.capsules || []).map((c) => ({ title: c.title, unlockType: c.unlockType, unlockDate: c.unlockDate })),
  }
  return `User's vault context (JSON):\n${JSON.stringify(safe)}\n\nUser question: ${question}`
}

// POST /api/ai/chat  { message, context }
aiRouter.post('/chat', async (req, res, next) => {
  try {
    const { message, context } = req.body || {}
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' })
    }

    if (isGeminiEnabled()) {
      try {
        const text = await callGemini(buildSystemPrompt(), buildContextPrompt(message, context))
        return res.json({ text, engine: 'gemini' })
      } catch (err) {
        console.warn('[AI] Gemini failed, falling back to EchoBrain:', err.message)
      }
    }

    const answer = echoAnswer(message, context)
    return res.json({ ...answer, engine: 'echo-brain' })
  } catch (err) {
    next(err)
  }
})

// POST /api/ai/categorize  { title }
aiRouter.post('/categorize', async (req, res, next) => {
  try {
    const { title } = req.body || {}
    if (isGeminiEnabled() && title) {
      try {
        const text = await callGemini(
          'You classify documents into exactly one of: Passport, National ID, Insurance, Property Documents, Business Documents, Certificates, Medical Records, Crypto Information, Personal Documents. Reply with only the category name.',
          `Document title: "${title}"`,
        )
        const clean = text.split('\n')[0].trim()
        return res.json({ category: clean, engine: 'gemini' })
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
    if (isGeminiEnabled() && (title || description)) {
      try {
        const text = await callGemini(
          'You write a single warm sentence (max 25 words) summarizing a personal memory for a digital legacy vault.',
          `Title: ${title}\nDescription: ${description}\nType: ${type}`,
        )
        return res.json({ summary: text.split('\n')[0].trim(), engine: 'gemini' })
      } catch (err) {
        console.warn('[AI] summarize fallback:', err.message)
      }
    }
    return res.json({ summary: summarizeText(title, description, type), engine: 'echo-brain' })
  } catch (err) {
    next(err)
  }
})

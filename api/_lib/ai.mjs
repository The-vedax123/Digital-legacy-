import { chatLLM, isLLMEnabled, activeProvider } from './llm.mjs'
import { echoAnswer, suggestCategory, summarizeText } from './echoBrain.mjs'
import { buildSystemPrompt, buildContextPrompt } from './prompt.mjs'

export async function handleChat({ message, context }) {
  if (isLLMEnabled()) {
    try {
      const text = await chatLLM(buildSystemPrompt(context), buildContextPrompt(message, context))
      if (text) return { text, engine: activeProvider() }
    } catch (err) {
      console.warn('[AI] LLM failed, falling back to EchoBrain:', err.message)
    }
  }
  return { ...echoAnswer(message, context), engine: 'echo-brain' }
}

export async function handleCategorize({ title }) {
  if (isLLMEnabled() && title) {
    try {
      const text = await chatLLM(
        'You classify documents into exactly one of: Passport, National ID, Insurance, Property Documents, Business Documents, Certificates, Medical Records, Crypto Information, Personal Documents. Reply with ONLY the category name, nothing else.',
        `Document title: "${title}"`,
      )
      const clean = (text || '').split('\n')[0].trim()
      if (clean) return { category: clean, engine: activeProvider() }
    } catch (err) {
      console.warn('[AI] categorize fallback:', err.message)
    }
  }
  return { category: suggestCategory(title), engine: 'echo-brain' }
}

export async function handleSummarize({ title, description, type }) {
  if (isLLMEnabled() && (title || description)) {
    try {
      const text = await chatLLM(
        'You write a single warm, heartfelt sentence (max 25 words) summarizing a personal memory for a digital legacy vault. Reply with only the sentence.',
        `Title: ${title}\nDescription: ${description}\nType: ${type}`,
      )
      const clean = (text || '').split('\n')[0].trim()
      if (clean) return { summary: clean, engine: activeProvider() }
    } catch (err) {
      console.warn('[AI] summarize fallback:', err.message)
    }
  }
  return { summary: summarizeText(title, description, type), engine: 'echo-brain' }
}

/** Reads and JSON-parses the request body for Vercel Node functions. */
export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return {}
  }
}

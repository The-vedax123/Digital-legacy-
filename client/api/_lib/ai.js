import { callGemini, isGeminiEnabled } from './gemini.js'
import { echoAnswer, suggestCategory, summarizeText } from './echoBrain.js'

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

export async function handleChat({ message, context }) {
  if (isGeminiEnabled()) {
    try {
      const text = await callGemini(buildSystemPrompt(), buildContextPrompt(message, context))
      return { text, engine: 'gemini' }
    } catch (err) {
      console.warn('[AI] Gemini failed, falling back to EchoBrain:', err.message)
    }
  }
  return { ...echoAnswer(message, context), engine: 'echo-brain' }
}

export async function handleCategorize({ title }) {
  if (isGeminiEnabled() && title) {
    try {
      const text = await callGemini(
        'You classify documents into exactly one of: Passport, National ID, Insurance, Property Documents, Business Documents, Certificates, Medical Records, Crypto Information, Personal Documents. Reply with only the category name.',
        `Document title: "${title}"`,
      )
      return { category: text.split('\n')[0].trim(), engine: 'gemini' }
    } catch (err) {
      console.warn('[AI] categorize fallback:', err.message)
    }
  }
  return { category: suggestCategory(title), engine: 'echo-brain' }
}

export async function handleSummarize({ title, description, type }) {
  if (isGeminiEnabled() && (title || description)) {
    try {
      const text = await callGemini(
        'You write a single warm sentence (max 25 words) summarizing a personal memory for a digital legacy vault.',
        `Title: ${title}\nDescription: ${description}\nType: ${type}`,
      )
      return { summary: text.split('\n')[0].trim(), engine: 'gemini' }
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

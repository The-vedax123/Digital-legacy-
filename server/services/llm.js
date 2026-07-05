/**
 * Multi-provider LLM client for EchoVault.
 *
 * Auto-detects a free provider from environment variables, in priority order:
 *   1. GROQ_API_KEY        → Groq (free, extremely fast Llama 3.3 70B)
 *   2. OPENROUTER_API_KEY  → OpenRouter (free community models)
 *   3. GEMINI_API_KEY      → Google Gemini (generous free tier)
 * If none are set, callers fall back to the offline EchoBrain.
 *
 * Get a free key:
 *   • Groq:       https://console.groq.com/keys
 *   • OpenRouter: https://openrouter.ai/keys
 *   • Gemini:     https://aistudio.google.com/app/apikey
 */

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free'
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

export function activeProvider() {
  if (process.env.GROQ_API_KEY) return 'groq'
  if (process.env.OPENROUTER_API_KEY) return 'openrouter'
  if (process.env.GEMINI_API_KEY) return 'gemini'
  return null
}

export const isLLMEnabled = () => Boolean(activeProvider())

async function openaiCompatible({ url, key, model, system, user, headers = {} }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, ...headers },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      max_tokens: 900,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return (data.choices?.[0]?.message?.content || '').trim()
}

async function callGemini({ system, user }) {
  const key = process.env.GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { role: 'system', parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 900 },
    }),
  })
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts || []
  return parts.map((p) => p.text).join('\n').trim()
}

/** Send a system + user prompt to the active provider. Throws if none configured. */
export async function chatLLM(system, user) {
  const provider = activeProvider()
  if (provider === 'groq') {
    return openaiCompatible({
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: process.env.GROQ_API_KEY,
      model: GROQ_MODEL,
      system,
      user,
    })
  }
  if (provider === 'openrouter') {
    return openaiCompatible({
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: process.env.OPENROUTER_API_KEY,
      model: OPENROUTER_MODEL,
      system,
      user,
      headers: { 'HTTP-Referer': 'https://echovault.app', 'X-Title': 'EchoVault' },
    })
  }
  if (provider === 'gemini') return callGemini({ system, user })
  throw new Error('No LLM provider configured')
}

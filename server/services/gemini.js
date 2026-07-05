const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

/**
 * Call the Google Gemini API. Returns the text response.
 * Throws if no API key or on network error.
 */
export async function callGemini(systemPrompt, userPrompt) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY not configured')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`

  const body = {
    systemInstruction: {
      role: 'system',
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts || []
  const text = parts.map((p) => p.text).join('\n').trim()
  return text || 'I could not generate a response.'
}

export const isGeminiEnabled = () => Boolean(process.env.GEMINI_API_KEY)

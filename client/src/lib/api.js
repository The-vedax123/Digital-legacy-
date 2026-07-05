const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export const ai = {
  async chat(message, context) {
    return post('/ai/chat', { message, context })
  },
  async categorize(title) {
    return post('/ai/categorize', { title })
  },
  async summarize(title, description, type) {
    return post('/ai/summarize', { title, description, type })
  },
}

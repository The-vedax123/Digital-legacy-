import { handleChat, readJsonBody } from '../_lib/ai.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { message, context } = await readJsonBody(req)
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' })
    }
    const result = await handleChat({ message, context })
    return res.status(200).json(result)
  } catch (err) {
    console.error('[AI] chat error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

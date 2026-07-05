import { handleSummarize, readJsonBody } from '../_lib/ai.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { title, description, type } = await readJsonBody(req)
    const result = await handleSummarize({ title, description, type })
    return res.status(200).json(result)
  } catch (err) {
    console.error('[AI] summarize error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

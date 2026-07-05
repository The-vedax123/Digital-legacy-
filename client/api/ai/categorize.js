import { handleCategorize, readJsonBody } from '../_lib/ai.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { title } = await readJsonBody(req)
    const result = await handleCategorize({ title })
    return res.status(200).json(result)
  } catch (err) {
    console.error('[AI] categorize error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

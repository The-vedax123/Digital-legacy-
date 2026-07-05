import { isGeminiEnabled } from './_lib/gemini.mjs'

export default function handler(_req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'echovault-api',
    platform: 'vercel',
    time: new Date().toISOString(),
    ai: isGeminiEnabled() ? 'gemini' : 'mock',
  })
}

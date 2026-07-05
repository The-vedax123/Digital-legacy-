import { activeProvider } from './_lib/llm.js'

export default function handler(_req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'echovault-api',
    platform: 'vercel',
    time: new Date().toISOString(),
    ai: activeProvider() || 'echo-brain',
  })
}

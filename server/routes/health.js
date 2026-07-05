import { Router } from 'express'
import { activeProvider } from '../services/llm.js'

export const healthRouter = Router()

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'echovault-api',
    time: new Date().toISOString(),
    ai: activeProvider() || 'echo-brain',
  })
})

import { Router } from 'express'

export const healthRouter = Router()

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'echovault-api',
    time: new Date().toISOString(),
    ai: process.env.GEMINI_API_KEY ? 'gemini' : 'mock',
  })
})

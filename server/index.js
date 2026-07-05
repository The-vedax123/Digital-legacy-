import express from 'express'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import { aiRouter } from './routes/ai.js'
import { healthRouter } from './routes/health.js'
import { activeProvider } from './services/llm.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(compression())
app.use(express.json({ limit: '5mb' }))

app.use('/api/health', healthRouter)
app.use('/api/ai', aiRouter)

app.get('/api', (_req, res) => {
  res.json({
    name: 'EchoVault API',
    status: 'ok',
    endpoints: ['/api/health', '/api/ai/chat', '/api/ai/summarize', '/api/ai/categorize'],
  })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[EchoVault] Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error', detail: err?.message })
})

app.listen(PORT, () => {
  console.log(`\n  EchoVault API running on http://localhost:${PORT}`)
  console.log(`  AI provider: ${activeProvider() || 'EchoBrain (offline fallback — set GROQ_API_KEY/OPENROUTER_API_KEY/GEMINI_API_KEY for an LLM)'}\n`)
})

import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Send, User, Bot } from 'lucide-react'
import { useData } from '../context/DataContext'
import { ai } from '../lib/api'

const suggestions = [
  'Where is my passport?',
  'Show business documents',
  'What expires next year?',
  'Summarize my memories',
  'Find insurance documents',
  'Organize my vault',
]

export default function Echo() {
  const data = useData()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi, I'm Echo — your personal legacy assistant. I know what's in your vault, so ask me anything: where a document is, what's expiring soon, or to summarize your memories.",
    },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef(null)
  const location = useLocation()
  const sentInitial = useRef(false)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    const prompt = location.state?.prompt
    if (prompt && !sentInitial.current) {
      sentInitial.current = true
      send(prompt)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  const send = async (text) => {
    const message = (text ?? input).trim()
    if (!message || busy) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: message }])
    setBusy(true)
    try {
      const context = data
        ? {
            documents: data.data.documents,
            memories: data.data.memories,
            contacts: data.data.contacts,
            capsules: data.data.capsules,
          }
        : {}
      const res = await ai.chat(message, context)
      setMessages((m) => [...m, { role: 'assistant', text: res.text, engine: res.engine }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'I had trouble reaching my brain just now. Please try again in a moment.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col lg:h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
          <Sparkles className="h-6 w-6 text-white" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-success dark:border-ink" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold">Echo AI</h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">Your intelligent legacy assistant · always here</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="glass no-scrollbar flex-1 space-y-4 overflow-y-auto rounded-3xl p-4 sm:p-6">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${m.role === 'user' ? 'bg-stone-500/15 text-stone-500 dark:text-stone-300' : 'bg-brand-gradient text-white'}`}>
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-brand-gradient text-white' : 'bg-stone-500/10 dark:bg-white/5'}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {busy && (
          <div className="flex gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-stone-500/10 px-4 py-3.5 dark:bg-white/5">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-brand" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        {suggestions.map((s) => (
          <button key={s} onClick={() => send(s)} disabled={busy} className="chip shrink-0 whitespace-nowrap bg-stone-500/10 text-stone-600 transition hover:bg-brand/10 hover:text-brand dark:text-stone-300">
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); send() }} className="mt-3 flex items-center gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Echo anything about your vault…" className="input flex-1" />
        <button type="submit" disabled={busy || !input.trim()} className="btn-primary h-12 w-12 shrink-0 !px-0">
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Images, Plus, Trash2, Sparkles, Camera, Video, Mic, Mail, BookOpen, Trophy } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useData } from '../context/DataContext'
import { useToast } from '../components/ui/Toast'
import { ai } from '../lib/api'
import { MEMORY_TYPES, timeAgo } from '../lib/utils'

const typeMeta = {
  photo: { icon: Camera, label: 'Photo', color: 'from-blue-500 to-brand' },
  video: { icon: Video, label: 'Video', color: 'from-rose-500 to-pink-500' },
  voice: { icon: Mic, label: 'Voice Note', color: 'from-violet2-500 to-fuchsia-500' },
  letter: { icon: Mail, label: 'Letter', color: 'from-amber-500 to-warning' },
  story: { icon: BookOpen, label: 'Story', color: 'from-emerald-500 to-success' },
  achievement: { icon: Trophy, label: 'Achievement', color: 'from-yellow-500 to-amber-500' },
}

export default function Memories() {
  const data = useData()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  if (!data) return null
  const { memories } = data.data
  const filtered = filter === 'all' ? memories : memories.filter((m) => m.type === filter)

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Memory Vault"
        subtitle="Photos, videos, voice notes and letters — the moments that make you, you."
        icon={Images}
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Create Memory
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterChip>
        {MEMORY_TYPES.map((t) => (
          <FilterChip key={t} active={filter === t} onClick={() => setFilter(t)}>
            {typeMeta[t].label}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No memories yet"
          description="Preserve a photo, a voice note, or a letter. Echo AI will craft a gentle summary of each one."
          action={<button onClick={() => setOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Create Memory</button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((m) => {
              const meta = typeMeta[m.type] || typeMeta.story
              const Icon = meta.icon
              return (
                <motion.div key={m.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="glass card-hover group overflow-hidden rounded-3xl">
                  <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${meta.color}`}>
                    <Icon className="h-12 w-12 text-white/90" />
                    <span className="absolute left-3 top-3 chip bg-black/20 text-white backdrop-blur">{meta.label}</span>
                    <button onClick={() => { data.deleteMemory(m.id); toast('Memory removed', 'info') }} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/20 text-white/80 opacity-0 backdrop-blur transition hover:bg-black/40 group-hover:opacity-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold leading-tight">{m.title}</h3>
                    {m.summary && (
                      <div className="mt-2 flex items-start gap-1.5 rounded-2xl bg-brand/5 p-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                        <span>{m.summary}</span>
                      </div>
                    )}
                    <p className="mt-3 text-xs text-slate-400">Saved {timeAgo(m.createdAt)}</p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <MemoryModal open={open} onClose={() => setOpen(false)} onSave={(m) => { data.addMemory(m); toast('Memory preserved', 'success'); setOpen(false) }} />
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`chip transition ${active ? 'bg-brand-gradient text-white shadow-glow' : 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 dark:text-slate-300'}`}>
      {children}
    </button>
  )
}

function MemoryModal({ open, onClose, onSave }) {
  const empty = { title: '', type: 'photo', description: '', summary: '' }
  const [form, setForm] = useState(empty)
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast('Please add a title', 'error')
    setBusy(true)
    let summary = form.summary
    try {
      const res = await ai.summarize(form.title, form.description, form.type)
      summary = res.summary
    } catch {
      summary = form.description || form.title
    }
    onSave({ ...form, summary })
    setForm(empty)
    setBusy(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Memory" subtitle="Echo AI will summarize this moment for you.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Type</label>
          <div className="grid grid-cols-3 gap-2">
            {MEMORY_TYPES.map((t) => {
              const M = typeMeta[t]
              const Icon = M.icon
              const active = form.type === t
              return (
                <button type="button" key={t} onClick={() => setForm((f) => ({ ...f, type: t }))} className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-semibold transition ${active ? 'border-brand bg-brand/10 text-brand' : 'border-slate-200 text-slate-500 hover:border-brand/40 dark:border-white/10 dark:text-slate-300'}`}>
                  <Icon className="h-5 w-5" /> {M.label}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <label className="label">Title</label>
          <input value={form.title} onChange={set('title')} placeholder="e.g. Our Wedding Day" className="input" required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Tell the story behind this memory…" className="input resize-none" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" disabled={busy} className="btn-primary flex-1">{busy ? 'Summarizing…' : 'Save Memory'}</button>
        </div>
      </form>
    </Modal>
  )
}

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderLock,
  Plus,
  Search,
  Upload,
  Trash2,
  Sparkles,
  FileText,
  ShieldAlert,
  Calendar,
  UserCheck,
  Filter,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useData } from '../context/DataContext'
import { useToast } from '../components/ui/Toast'
import { ai } from '../lib/api'
import {
  DOC_CATEGORIES,
  IMPORTANCE_LEVELS,
  importanceColor,
  formatDate,
  timeAgo,
} from '../lib/utils'

const catColors = {
  Passport: 'bg-blue-500/15 text-blue-500',
  'National ID': 'bg-cyan-500/15 text-cyan-500',
  Insurance: 'bg-emerald-500/15 text-emerald-500',
  'Property Documents': 'bg-amber-500/15 text-amber-500',
  'Business Documents': 'bg-indigo-500/15 text-indigo-500',
  Certificates: 'bg-violet-500/15 text-violet-500',
  'Medical Records': 'bg-rose-500/15 text-rose-500',
  'Crypto Information': 'bg-orange-500/15 text-orange-500',
  'Personal Documents': 'bg-slate-500/15 text-slate-500',
}

export default function Vault() {
  const data = useData()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [sortBy, setSortBy] = useState('recent')

  const filtered = useMemo(() => {
    let list = (data?.data.documents ?? []).filter((d) => {
      const hay = `${d.title} ${d.category} ${d.description} ${d.beneficiary}`.toLowerCase()
      const matchQ = hay.includes(query.toLowerCase())
      const matchC = filterCat === 'All' || d.category === filterCat
      return matchQ && matchC
    })
    list = [...list].sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'importance') {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
        return (order[a.importance] ?? 4) - (order[b.importance] ?? 4)
      }
      return 0
    })
    return list
  }, [data, query, filterCat, sortBy])

  if (!data) return null

  const remove = (id, title) => {
    data.deleteDocument(id)
    toast(`Deleted “${title}”`, 'info')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Digital Vault"
        subtitle="Your most important documents, encrypted and organized."
        icon={FolderLock}
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Upload Document
          </button>
        }
      />

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents…" className="input pl-11" />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input !w-auto appearance-none pl-9 pr-8">
              <option>All</option>
              {DOC_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input !w-auto appearance-none">
            <option value="recent">Newest</option>
            <option value="title">A–Z</option>
            <option value="importance">Importance</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderLock}
          title={query || filterCat !== 'All' ? 'No matching documents' : 'Your vault is empty'}
          description={query || filterCat !== 'All' ? 'Try adjusting your search or filters.' : 'Upload your first document to keep it safe and pass it on to the right people.'}
          action={
            <button onClick={() => setOpen(true)} className="btn-primary">
              <Upload className="h-4 w-4" /> Upload Document
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="glass card-hover group rounded-3xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/10 text-brand">
                    <FileText className="h-5 w-5" />
                  </div>
                  <button onClick={() => remove(doc.id, doc.title)} className="text-slate-300 opacity-0 transition hover:text-danger group-hover:opacity-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-4 font-bold leading-tight">{doc.title}</h3>
                {doc.description && <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{doc.description}</p>}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className={`chip ${catColors[doc.category] || 'bg-slate-500/15 text-slate-500'}`}>{doc.category}</span>
                  <span className={`chip ${importanceColor(doc.importance)}`}>
                    <ShieldAlert className="h-3 w-3" /> {doc.importance}
                  </span>
                </div>
                <div className="mt-3 space-y-1 border-t border-slate-200/60 pt-3 text-xs text-slate-500 dark:border-white/5 dark:text-slate-400">
                  {doc.beneficiary && (
                    <p className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5" /> {doc.beneficiary}</p>
                  )}
                  {doc.expiryDate && (
                    <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Expires {formatDate(doc.expiryDate)}</p>
                  )}
                  <p className="opacity-70">Added {timeAgo(doc.createdAt)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <UploadModal open={open} onClose={() => setOpen(false)} onSave={(doc) => { data.addDocument(doc); toast('Document secured in your vault', 'success'); setOpen(false) }} />
    </div>
  )
}

function UploadModal({ open, onClose, onSave }) {
  const empty = { title: '', category: 'Personal Documents', description: '', importance: 'High', beneficiary: '', expiryDate: '', fileName: '' }
  const [form, setForm] = useState(empty)
  const [aiBusy, setAiBusy] = useState(false)
  const toast = useToast()

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((f) => ({ ...f, fileName: file.name, title: f.title || file.name.replace(/\.[^.]+$/, '') }))
  }

  const autoCategorize = async () => {
    if (!form.title) return toast('Add a title first', 'info')
    setAiBusy(true)
    try {
      const { category } = await ai.categorize(form.title)
      setForm((f) => ({ ...f, category }))
      toast(`Echo suggested: ${category}`, 'success')
    } catch {
      toast('Could not reach Echo AI', 'error')
    } finally {
      setAiBusy(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast('Please add a title', 'error')
    onSave(form)
    setForm(empty)
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload Document" subtitle="Add a document to your encrypted vault." size="lg">
      <form onSubmit={submit} className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-500/5 py-8 text-center transition hover:border-brand hover:bg-brand/5 dark:border-white/10">
          <Upload className="h-8 w-8 text-brand" />
          <span className="mt-2 text-sm font-semibold">{form.fileName || 'Click to select a file'}</span>
          <span className="text-xs text-slate-400">PDF, image or document · stored securely</span>
          <input type="file" className="hidden" onChange={onFile} />
        </label>

        <div>
          <div className="flex items-center justify-between">
            <label className="label">Title</label>
            <button type="button" onClick={autoCategorize} disabled={aiBusy} className="mb-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline disabled:opacity-50">
              <Sparkles className="h-3.5 w-3.5" /> {aiBusy ? 'Thinking…' : 'Auto-categorize'}
            </button>
          </div>
          <input value={form.title} onChange={set('title')} placeholder="e.g. International Passport" className="input" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Category</label>
            <select value={form.category} onChange={set('category')} className="input">
              {DOC_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Importance</label>
            <select value={form.importance} onChange={set('importance')} className="input">
              {IMPORTANCE_LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={2} placeholder="Notes, policy numbers, where the original is kept…" className="input resize-none" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Beneficiary</label>
            <input value={form.beneficiary} onChange={set('beneficiary')} placeholder="Who should inherit this?" className="input" />
          </div>
          <div>
            <label className="label">Expiry date (optional)</label>
            <input type="date" value={form.expiryDate ? form.expiryDate.slice(0, 10) : ''} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))} className="input" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">Save to Vault</button>
        </div>
      </form>
    </Modal>
  )
}

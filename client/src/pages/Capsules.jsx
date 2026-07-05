import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hourglass, Plus, Trash2, Lock, Unlock, Gift, Heart, Sparkles } from 'lucide-react'
import { addDays, addYears } from 'date-fns'
import PageHeader from '../components/PageHeader'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useData } from '../context/DataContext'
import { useToast } from '../components/ui/Toast'
import { CAPSULE_UNLOCK, getCountdown, formatDate } from '../lib/utils'

const capsuleItems = ['Letter', 'Photos', 'Video', 'Voice', 'Documents']

export default function Capsules() {
  const data = useData()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [viewing, setViewing] = useState(null)

  if (!data) return null
  const { capsules } = data.data

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Time Capsules"
        subtitle="Seal a message today. Deliver it on the perfect day in the future."
        icon={Hourglass}
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Create Capsule
          </button>
        }
      />

      {capsules.length === 0 ? (
        <EmptyState
          icon={Hourglass}
          title="No capsules sealed yet"
          description="Write a birthday message, an anniversary note, or words for a future child. We’ll keep it safe until the moment is right."
          action={<button onClick={() => setOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Create your first capsule</button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {capsules.map((c) => (
              <CapsuleCard key={c.id} capsule={c} onOpen={() => setViewing(c)} onDelete={() => { data.deleteCapsule(c.id); toast('Capsule removed', 'info') }} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <CapsuleModal open={open} onClose={() => setOpen(false)} onSave={(c) => { data.addCapsule(c); toast('Time capsule sealed 🔒', 'success'); setOpen(false) }} />
      <ViewCapsule capsule={viewing} onClose={() => setViewing(null)} />
    </div>
  )
}

function CapsuleCard({ capsule, onOpen, onDelete }) {
  const [c, setC] = useState(() => getCountdown(capsule.unlockDate))
  const manual = capsule.unlockType === 'manual'
  const unlocked = manual || c.done

  useEffect(() => {
    if (manual) return
    const t = setInterval(() => setC(getCountdown(capsule.unlockDate)), 1000)
    return () => clearInterval(t)
  }, [capsule.unlockDate, manual])

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="glass card-hover group overflow-hidden rounded-3xl">
      <div className={`relative p-5 ${unlocked ? 'bg-gradient-to-br from-success to-emerald-600' : 'bg-brand-gradient'} text-white`}>
        <div className="flex items-start justify-between">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            {unlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
          <button onClick={onDelete} className="text-white/60 opacity-0 transition hover:text-white group-hover:opacity-100">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-3 font-bold leading-tight">{capsule.title}</h3>
        <p className="text-xs text-white/80">For {capsule.recipient || 'the future'}</p>

        {!unlocked ? (
          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {[{ v: c.days, l: 'D' }, { v: c.hours, l: 'H' }, { v: c.minutes, l: 'M' }, { v: c.seconds, l: 'S' }].map((p) => (
              <div key={p.l} className="rounded-xl bg-white/15 py-2 text-center backdrop-blur">
                <p className="text-lg font-extrabold tabular-nums">{String(p.v).padStart(2, '0')}</p>
                <p className="text-[9px] uppercase opacity-70">{p.l}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur">Ready to open ✨</p>
        )}
      </div>
      <div className="p-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(capsule.items || []).map((i) => (
            <span key={i} className="chip bg-stone-500/10 text-stone-500 dark:text-stone-300">{i}</span>
          ))}
        </div>
        <p className="mb-3 text-xs text-stone-400">{manual ? 'Manual unlock' : `Unlocks ${formatDate(capsule.unlockDate)}`}</p>
        <button onClick={onOpen} disabled={!unlocked} className={unlocked ? 'btn-primary w-full !py-2.5' : 'btn-ghost w-full !py-2.5'}>
          {unlocked ? <><Gift className="h-4 w-4" /> Open Capsule</> : <><Lock className="h-4 w-4" /> Sealed</>}
        </button>
      </div>
    </motion.div>
  )
}

function ViewCapsule({ capsule, onClose }) {
  return (
    <Modal open={!!capsule} onClose={onClose} title={capsule?.title} subtitle={`A message for ${capsule?.recipient || 'the future'}`}>
      {capsule && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-brand-gradient p-6 text-white">
            <Heart className="h-6 w-6" />
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{capsule.message || 'No message written.'}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(capsule.items || []).map((i) => (
              <span key={i} className="chip bg-brand/10 text-brand">{i}</span>
            ))}
          </div>
          <button onClick={onClose} className="btn-ghost w-full">Close</button>
        </div>
      )}
    </Modal>
  )
}

function CapsuleModal({ open, onClose, onSave }) {
  const empty = { title: '', recipient: '', message: '', unlockType: 'birthday', unlockDate: '', items: ['Letter'] }
  const [form, setForm] = useState(empty)
  const toast = useToast()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const toggleItem = (item) =>
    setForm((f) => ({ ...f, items: f.items.includes(item) ? f.items.filter((i) => i !== item) : [...f.items, item] }))

  const defaultDate = (type) => {
    const now = new Date()
    if (type === 'years5') return addYears(now, 5)
    if (type === 'graduation') return addYears(now, 4)
    if (type === 'birthday') return addYears(now, 1)
    if (type === 'anniversary') return addDays(now, 365)
    return null
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast('Please add a title', 'error')
    let unlockDate = form.unlockDate ? new Date(form.unlockDate).toISOString() : ''
    if (form.unlockType !== 'manual' && !unlockDate) {
      const d = defaultDate(form.unlockType)
      unlockDate = d ? d.toISOString() : ''
    }
    onSave({ ...form, unlockDate })
    setForm(empty)
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Time Capsule" subtitle="Words that arrive exactly when they’re needed." size="lg">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Title</label>
            <input value={form.title} onChange={set('title')} placeholder="Happy 18th Birthday" className="input" required />
          </div>
          <div>
            <label className="label">Recipient</label>
            <input value={form.recipient} onChange={set('recipient')} placeholder="Zara" className="input" />
          </div>
        </div>

        <div>
          <label className="label">Message</label>
          <textarea value={form.message} onChange={set('message')} rows={4} placeholder="Write from the heart…" className="input resize-none" />
        </div>

        <div>
          <label className="label">When should it open?</label>
          <select value={form.unlockType} onChange={set('unlockType')} className="input">
            {CAPSULE_UNLOCK.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {form.unlockType !== 'manual' && (
          <div>
            <label className="label">Unlock date {form.unlockType !== 'manual' && '(optional — we’ll pick a default)'}</label>
            <input type="date" value={form.unlockDate ? form.unlockDate.slice(0, 10) : ''} onChange={(e) => setForm((f) => ({ ...f, unlockDate: e.target.value }))} className="input" />
          </div>
        )}

        <div>
          <label className="label">What’s inside?</label>
          <div className="flex flex-wrap gap-2">
            {capsuleItems.map((item) => (
              <button type="button" key={item} onClick={() => toggleItem(item)} className={`chip transition ${form.items.includes(item) ? 'bg-brand-gradient text-white' : 'bg-stone-500/10 text-stone-500 dark:text-stone-300'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-brand/5 p-3 text-xs text-stone-500 dark:text-stone-400">
          <Sparkles className="h-4 w-4 shrink-0 text-brand" />
          Once sealed, this capsule stays locked with a live countdown until its moment arrives.
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1"><Lock className="h-4 w-4" /> Seal Capsule</button>
        </div>
      </form>
    </Modal>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Trash2, Phone, Mail, Shield, UserPlus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useData } from '../context/DataContext'
import { useToast } from '../components/ui/Toast'
import { PERMISSION_LEVELS, permissionColor } from '../lib/utils'

const permissionDesc = {
  Viewer: 'Can view items you explicitly share.',
  Family: 'Full family access to memories & personal documents.',
  Lawyer: 'Access to legal & estate documents.',
  'Business Partner': 'Access to business documents & assets.',
  Administrator: 'Complete access — manages the vault on your behalf.',
}

export default function Circle() {
  const data = useData()
  const toast = useToast()
  const [open, setOpen] = useState(false)

  if (!data) return null
  const { contacts } = data.data

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Trusted Circle"
        subtitle="The people who can access your legacy — each with the right level of trust."
        icon={Users}
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Contact
          </button>
        }
      />

      {contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Your circle is empty"
          description="Add the people you trust most. Assign each a permission level so the right person has the right access when it matters."
          action={<button onClick={() => setOpen(true)} className="btn-primary"><UserPlus className="h-4 w-4" /> Add your first contact</button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <AnimatePresence>
            {contacts.map((c) => (
              <motion.div key={c.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="glass card-hover group rounded-3xl p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-lg font-bold text-white">
                    {c.name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold leading-tight">{c.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{c.relationship}</p>
                      </div>
                      <button onClick={() => { data.deleteContact(c.id); toast('Contact removed', 'info') }} className="text-slate-300 opacity-0 transition hover:text-danger group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className={`chip mt-2 ${permissionColor(c.permission)}`}>
                      <Shield className="h-3 w-3" /> {c.permission}
                    </span>
                    <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {c.phone && <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {c.phone}</p>}
                      {c.email && <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {c.email}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ContactModal open={open} onClose={() => setOpen(false)} onSave={(c) => { data.addContact(c); toast('Added to your Trusted Circle', 'success'); setOpen(false) }} />
    </div>
  )
}

function ContactModal({ open, onClose, onSave }) {
  const empty = { name: '', relationship: '', phone: '', email: '', permission: 'Family' }
  const [form, setForm] = useState(empty)
  const toast = useToast()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast('Please add a name', 'error')
    onSave(form)
    setForm(empty)
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Trusted Contact" subtitle="Give someone you trust the right level of access.">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input value={form.name} onChange={set('name')} placeholder="Amara Okafor" className="input" required />
          </div>
          <div>
            <label className="label">Relationship</label>
            <input value={form.relationship} onChange={set('relationship')} placeholder="Spouse" className="input" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input value={form.phone} onChange={set('phone')} placeholder="+234 800 000 0000" className="input" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="name@example.com" className="input" />
          </div>
        </div>
        <div>
          <label className="label">Permission level</label>
          <select value={form.permission} onChange={set('permission')} className="input">
            {PERMISSION_LEVELS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{permissionDesc[form.permission]}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">Add Contact</button>
        </div>
      </form>
    </Modal>
  )
}

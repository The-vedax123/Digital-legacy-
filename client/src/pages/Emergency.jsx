import { useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { HeartPulse, Droplet, Phone, Stethoscope, Pill, ShieldAlert, Save, Pencil, ScanLine } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'

export default function Emergency() {
  const data = useData()
  const { user } = useAuth()
  const toast = useToast()
  const [editing, setEditing] = useState(false)

  if (!data) return null
  const e = data.data.emergency

  const qrPayload = JSON.stringify({
    name: user?.name,
    bloodGroup: e.bloodGroup,
    allergies: e.allergies,
    conditions: e.conditions,
    medication: e.medication,
    doctor: e.doctor,
    emergencyContacts: e.emergencyContacts,
    source: 'EchoVault Emergency Card',
  })

  const fields = [
    { key: 'bloodGroup', label: 'Blood Group', icon: Droplet, color: 'text-danger' },
    { key: 'allergies', label: 'Allergies', icon: ShieldAlert, color: 'text-warning' },
    { key: 'conditions', label: 'Medical Conditions', icon: HeartPulse, color: 'text-rose-500' },
    { key: 'medication', label: 'Current Medication', icon: Pill, color: 'text-brand' },
    { key: 'insurance', label: 'Insurance', icon: ShieldAlert, color: 'text-emerald-500' },
    { key: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'text-violet2-400' },
    { key: 'emergencyContacts', label: 'Emergency Contacts', icon: Phone, color: 'text-success' },
  ]

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Emergency Card"
        subtitle="Life-saving information, one scan away when seconds count."
        icon={HeartPulse}
        action={
          <button onClick={() => setEditing((v) => !v)} className={editing ? 'btn-ghost' : 'btn-primary'}>
            {editing ? <>Done</> : <><Pencil className="h-4 w-4" /> Edit</>}
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden rounded-3xl lg:col-span-2">
          <div className="bg-gradient-to-br from-danger to-rose-600 p-6 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest opacity-90">
              <HeartPulse className="h-5 w-5" /> Emergency Medical Card
            </div>
            <h2 className="mt-2 text-2xl font-extrabold">{user?.name}</h2>
            <p className="text-sm text-white/80">In case of emergency, please review the details below.</p>
          </div>

          <div className="grid gap-px bg-slate-200/60 p-px dark:bg-white/5 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className="bg-white p-4 dark:bg-surface">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <f.icon className={`h-4 w-4 ${f.color}`} /> {f.label}
                </div>
                {editing ? (
                  <input
                    value={e[f.key] || ''}
                    onChange={(ev) => data.updateEmergency({ [f.key]: ev.target.value })}
                    placeholder={`Add ${f.label.toLowerCase()}…`}
                    className="input mt-2 !py-2 !text-sm"
                  />
                ) : (
                  <p className="mt-1 text-sm font-medium">{e[f.key] || <span className="text-slate-400">Not set</span>}</p>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <div className="p-4">
              <button onClick={() => { setEditing(false); toast('Emergency card saved', 'success') }} className="btn-primary w-full">
                <Save className="h-4 w-4" /> Save Emergency Card
              </button>
            </div>
          )}
        </motion.div>

        {/* QR */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass flex flex-col items-center rounded-3xl p-6 text-center">
          <div className="flex items-center gap-2 text-sm font-bold">
            <ScanLine className="h-5 w-5 text-brand" /> Scan for details
          </div>
          <div className="mt-5 rounded-3xl bg-white p-4 shadow-lg">
            <QRCodeSVG value={qrPayload} size={168} level="M" fgColor="#0F172A" />
          </div>
          <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
            First responders can scan this code to instantly access your critical medical information — even if your phone is locked.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

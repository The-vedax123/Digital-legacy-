import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FolderLock,
  Images,
  Users,
  Hourglass,
  HardDrive,
  Upload,
  UserPlus,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { estimateStorage, timeAgo, getCountdown } from '../lib/utils'

const activityIcon = {
  upload: FolderLock,
  memory: Images,
  contact: Users,
  capsule: Hourglass,
}

export default function Dashboard() {
  const data = useData()
  const { user } = useAuth()
  if (!data) return null

  const { documents, memories, contacts, capsules, activity } = data.data
  const storage = estimateStorage(data.data)

  const nextCapsule = [...capsules]
    .filter((c) => c.unlockType !== 'manual' && c.unlockDate)
    .sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate))[0]

  const stats = [
    { label: 'Documents Stored', value: documents.length, icon: FolderLock, to: '/app/vault', color: 'from-blue-500 to-brand' },
    { label: 'Memories', value: memories.length, icon: Images, to: '/app/memories', color: 'from-violet2-500 to-fuchsia-500' },
    { label: 'Trusted Contacts', value: contacts.length, icon: Users, to: '/app/circle', color: 'from-emerald-500 to-success' },
    { label: 'Time Capsules', value: capsules.length, icon: Hourglass, to: '/app/capsules', color: 'from-amber-500 to-warning' },
  ]

  const quickActions = [
    { label: 'Upload Document', icon: Upload, to: '/app/vault' },
    { label: 'Create Memory', icon: Images, to: '/app/memories' },
    { label: 'Add Contact', icon: UserPlus, to: '/app/circle' },
    { label: 'Create Time Capsule', icon: Hourglass, to: '/app/capsules' },
  ]

  const firstName = (user?.name || 'there').split(' ')[0]

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm font-semibold text-brand">Welcome back</p>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Hello, {firstName} 👋</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Here’s the state of your digital legacy today.</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={s.to} className="glass card-hover block rounded-3xl p-5">
              <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.to} className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200/60 bg-white/40 p-4 text-center transition hover:border-brand/40 hover:bg-brand/5 dark:border-white/10 dark:bg-white/5">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow transition group-hover:scale-105">
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>

          {/* Echo AI prompt */}
          <Link to="/app/echo" className="mt-4 flex items-center gap-3 rounded-2xl bg-brand-gradient p-4 text-white transition hover:brightness-105">
            <Sparkles className="h-6 w-6 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold">Ask Echo AI anything</p>
              <p className="text-xs text-white/80">“Where is my passport?” · “What expires next year?”</p>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {/* Storage */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-brand" />
            <h2 className="text-lg font-bold">Storage Used</h2>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <p className="text-3xl font-extrabold">{storage.usedGb.toFixed(1)}<span className="text-base font-semibold text-slate-400"> / {storage.totalGb} GB</span></p>
            <span className="chip bg-brand/10 text-brand">{storage.percent}%</span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <motion.div initial={{ width: 0 }} animate={{ width: `${storage.percent}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-brand-gradient" />
          </div>
          <div className="mt-5 space-y-2 text-sm">
            <Row label="Documents" value={documents.length} />
            <Row label="Memories" value={memories.length} />
            <Row label="Capsules" value={capsules.length} />
          </div>
        </motion.div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Recent Activity</h2>
          <div className="mt-4 space-y-1">
            {activity.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No activity yet — start by uploading a document.</p>}
            {activity.slice(0, 6).map((a) => {
              const Icon = activityIcon[a.type] || ShieldCheck
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-slate-500/5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="flex-1 text-sm font-medium">{a.text}</p>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" /> {timeAgo(a.at)}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Next capsule countdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden rounded-3xl">
          <div className="bg-brand-gradient p-6 text-white">
            <div className="flex items-center gap-2">
              <Hourglass className="h-5 w-5" />
              <h2 className="text-lg font-bold">Next Time Capsule</h2>
            </div>
            {nextCapsule ? (
              <>
                <p className="mt-4 text-sm font-semibold">{nextCapsule.title}</p>
                <CapsuleCountdown target={nextCapsule.unlockDate} />
              </>
            ) : (
              <p className="mt-4 text-sm text-white/80">No upcoming capsules. Create one to leave a message for the future.</p>
            )}
          </div>
          <Link to="/app/capsules" className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-brand hover:underline">
            {nextCapsule ? 'View all capsules' : 'Create a capsule'} <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function CapsuleCountdown({ target }) {
  const c = getCountdown(target)
  const parts = [
    { v: c.days, l: 'Days' },
    { v: c.hours, l: 'Hrs' },
    { v: c.minutes, l: 'Min' },
  ]
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {parts.map((p) => (
        <div key={p.l} className="rounded-2xl bg-white/15 p-3 text-center backdrop-blur">
          <p className="text-2xl font-extrabold">{String(p.v).padStart(2, '0')}</p>
          <p className="text-[10px] uppercase opacity-80">{p.l}</p>
        </div>
      ))}
    </div>
  )
}

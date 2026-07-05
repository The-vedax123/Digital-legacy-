import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  FileText,
  Images,
  Users,
  Hourglass,
  HardDrive,
  Upload,
  UserPlus,
  Sparkles,
  Cloud,
  ShieldCheck,
  Gift,
  Send,
  Check,
  Quote,
  Leaf,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { estimateStorage, timeAgo, getCountdown } from '../lib/utils'
import Sparkline from '../components/Sparkline'
import TreeScene from '../components/TreeScene'

const activityIcon = { upload: FileText, memory: Images, contact: Users, capsule: Hourglass }

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const data = useData()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ask, setAsk] = useState('')
  if (!data) return null

  const { documents, memories, contacts, capsules, activity } = data.data
  const storage = estimateStorage(data.data)
  const firstName = (user?.name || 'there').split(' ')[0]

  const nextCapsule = [...capsules]
    .filter((c) => c.unlockType !== 'manual' && c.unlockDate)
    .sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate))[0]

  const stats = [
    { label: 'Documents', value: documents.length, sub: 'Stored securely', icon: FileText, to: '/app/vault', color: '#6f8f68', tint: 'bg-sage/12 text-sage', spark: [6, 9, 7, 12, 10, 14, 12, 16] },
    { label: 'Memories', value: memories.length, sub: 'Photos, videos, notes', icon: Images, to: '/app/memories', color: '#9887c0', tint: 'bg-lav/12 text-lav', spark: [8, 10, 14, 11, 16, 13, 18, 20] },
    { label: 'Trusted Contacts', value: contacts.length, sub: 'People you trust', icon: Users, to: '/app/circle', color: '#c1a15a', tint: 'bg-sand/15 text-sand', spark: [4, 5, 5, 7, 6, 8, 8, 9] },
    { label: 'Time Capsules', value: capsules.length, sub: 'Messages to the future', icon: Hourglass, to: '/app/capsules', color: '#7f9fbe', tint: 'bg-sky/12 text-sky', spark: [3, 4, 6, 5, 7, 6, 8, 10] },
  ]

  const quickActions = [
    { label: 'Upload Document', icon: Upload, to: '/app/vault', tint: 'bg-sage/12 text-sage' },
    { label: 'Add Memory', icon: Images, to: '/app/memories', tint: 'bg-lav/12 text-lav' },
    { label: 'Add Contact', icon: UserPlus, to: '/app/circle', tint: 'bg-sand/15 text-sand' },
    { label: 'Create Time Capsule', icon: Hourglass, to: '/app/capsules', tint: 'bg-sky/12 text-sky' },
  ]

  const askEcho = (e) => {
    e.preventDefault()
    navigate('/app/echo', { state: { prompt: ask } })
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">
          {greeting()}, {firstName} <span className="align-middle">👋</span>
        </h1>
        <p className="mt-1 text-stone-500 dark:text-stone-400">Here’s what’s happening in your legacy today.</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={s.to} className="glass card-hover block overflow-hidden rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div className={`grid h-11 w-11 place-items-center rounded-2xl ${s.tint}`}>
                  <s.icon className="h-5 w-5" strokeWidth={2} />
                </div>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone-400">{s.label}</p>
              <p className="mt-0.5 text-3xl font-bold text-bark dark:text-stone-100">{s.value}</p>
              <p className="text-xs text-stone-400">{s.sub}</p>
              <Sparkline color={s.color} data={s.spark} className="mt-3" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Legacy overview */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass relative overflow-hidden rounded-3xl p-6 lg:col-span-2">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold">Your Legacy Overview</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">A summary of what matters most.</p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-black/5 p-3.5 dark:border-white/5">
                  <div className="flex items-center gap-2.5">
                    <HardDrive className="h-4 w-4 text-brand-600" />
                    <span className="text-sm font-semibold">Vault Size</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    {storage.usedGb.toFixed(2)} GB / {storage.totalGb} GB used
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-200/70 dark:bg-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${storage.percent}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-brand-gradient" />
                  </div>
                </div>

                <OverviewRow icon={Cloud} title="Last Backup" desc="2 days ago" />
                <OverviewRow icon={ShieldCheck} title="Security Status" desc="All systems secure" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <TreeScene className="w-full max-w-[280px]" />
              <p className="-mt-2 text-sm font-medium text-brand-700 dark:text-brand-300">Your legacy is growing<br />and protected.</p>
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Daily reflection */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass relative overflow-hidden rounded-3xl p-6">
            <Leaf className="absolute right-4 top-4 h-6 w-6 text-sage/40" />
            <h2 className="text-lg font-semibold">Daily Reflection</h2>
            <Quote className="mt-3 h-5 w-5 text-brand-400" />
            <p className="mt-2 text-sm italic leading-relaxed text-stone-600 dark:text-stone-300">
              What you leave behind is not what is engraved in stone monuments, but what is woven into the lives of others.
            </p>
          </motion.div>

          {/* Next capsule */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Next Time Capsule</h2>
              <Link to="/app/capsules" className="text-xs font-semibold text-brand-600 hover:underline">View all</Link>
            </div>
            {nextCapsule ? (
              <div className="mt-3 flex gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-sand/15 text-sand">
                  <Gift className="h-8 w-8" strokeWidth={1.6} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{nextCapsule.title}</p>
                  <p className="truncate text-xs text-stone-500 dark:text-stone-400">For {nextCapsule.recipient || 'the future'}</p>
                  <CapsuleCountdown target={nextCapsule.unlockDate} />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">No upcoming capsules. Create one to leave a message for the future.</p>
            )}
          </motion.div>

          {/* Recent activity */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="mt-3 space-y-1">
              {activity.length === 0 && <p className="py-4 text-center text-sm text-stone-400">No activity yet.</p>}
              {activity.slice(0, 4).map((a) => {
                const Icon = activityIcon[a.type] || ShieldCheck
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-2xl px-1 py-2">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/8 text-brand-700 dark:bg-white/5 dark:text-brand-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="flex-1 truncate text-sm">{a.text}</p>
                    <span className="shrink-0 text-xs text-stone-400">{timeAgo(a.at)}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6">
        <h2 className="mb-3 text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.to} className="glass card-hover flex flex-col items-start gap-3 rounded-3xl p-5">
              <div className={`grid h-11 w-11 place-items-center rounded-2xl ${a.tint}`}>
                <a.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Echo AI bar */}
      <form onSubmit={askEcho} className="mt-4">
        <div className="flex items-center gap-3 rounded-3xl bg-brand-gradient p-3 pl-5 text-white shadow-glow">
          <Sparkles className="h-5 w-5 shrink-0" />
          <div className="hidden sm:block">
            <span className="text-sm font-bold">Echo AI Assistant</span>
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Beta</span>
          </div>
          <input
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            placeholder="Ask me anything about your legacy…"
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder-white/70 outline-none"
          />
          <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/20 transition hover:bg-white/30">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

function OverviewRow({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/5 p-3.5 dark:border-white/5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/8 text-brand-700 dark:bg-white/5 dark:text-brand-300">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400">{desc}</p>
      </div>
      <span className="grid h-6 w-6 place-items-center rounded-full bg-success/15 text-success">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </div>
  )
}

function CapsuleCountdown({ target }) {
  const c = getCountdown(target)
  const parts = [
    { v: c.days, l: 'Days' },
    { v: c.hours, l: 'Hrs' },
    { v: c.minutes, l: 'Mins' },
    { v: c.seconds, l: 'Secs' },
  ]
  return (
    <div className="mt-2 flex gap-2">
      {parts.map((p, i) => (
        <div key={p.l} className="flex items-baseline gap-2">
          <div className="text-center">
            <span className="text-base font-bold tabular-nums text-brand-700 dark:text-brand-300">{String(p.v).padStart(2, '0')}</span>
            <span className="block text-[9px] uppercase text-stone-400">{p.l}</span>
          </div>
          {i < parts.length - 1 && <span className="text-stone-300">:</span>}
        </div>
      ))}
    </div>
  )
}

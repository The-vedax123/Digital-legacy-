import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  HardDrive,
  Lock,
  Sparkles,
  Moon,
  Sun,
  RotateCcw,
  Trash2,
  LogOut,
  Check,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../components/ui/Toast'
import { useNavigate } from 'react-router-dom'
import { estimateStorage } from '../lib/utils'

export default function Settings() {
  const { user, updateProfile, signOut, isSupabaseEnabled } = useAuth()
  const data = useData()
  const { theme, setTheme } = useTheme()
  const toast = useToast()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [toggles, setToggles] = useState({
    expiryReminders: true,
    capsuleAlerts: true,
    securityAlerts: true,
    aiSuggestions: true,
    smartCategorize: true,
    privacyLock: false,
  })

  if (!data) return null
  const storage = estimateStorage(data.data)

  const saveProfile = () => {
    updateProfile({ name })
    toast('Profile updated', 'success')
  }

  const flip = (k) => setToggles((t) => ({ ...t, [k]: !t[k] }))

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your profile, security, and preferences." icon={SettingsIcon} />

      <div className="space-y-4">
        {/* Profile */}
        <Card icon={User} title="Profile">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input value={user?.email || ''} disabled className="input opacity-60" />
            </div>
          </div>
          <button onClick={saveProfile} className="btn-primary mt-4"><Check className="h-4 w-4" /> Save Changes</button>
        </Card>

        {/* Theme */}
        <Card icon={Palette} title="Theme">
          <div className="grid grid-cols-2 gap-3">
            <ThemeOption active={theme === 'light'} onClick={() => setTheme('light')} icon={Sun} label="Light" />
            <ThemeOption active={theme === 'dark'} onClick={() => setTheme('dark')} icon={Moon} label="Dark" />
          </div>
        </Card>

        {/* Notifications */}
        <Card icon={Bell} title="Notifications">
          <Toggle label="Document expiry reminders" desc="Get notified before passports & policies expire." on={toggles.expiryReminders} onClick={() => flip('expiryReminders')} />
          <Toggle label="Time capsule alerts" desc="Know when a capsule is about to unlock." on={toggles.capsuleAlerts} onClick={() => flip('capsuleAlerts')} />
          <Toggle label="Security alerts" desc="Sign-in and access notifications." on={toggles.securityAlerts} onClick={() => flip('securityAlerts')} />
        </Card>

        {/* AI */}
        <Card icon={Sparkles} title="AI Settings">
          <Toggle label="Echo AI suggestions" desc="Let Echo suggest beneficiaries and reminders." on={toggles.aiSuggestions} onClick={() => flip('aiSuggestions')} />
          <Toggle label="Smart categorization" desc="Automatically categorize new documents." on={toggles.smartCategorize} onClick={() => flip('smartCategorize')} />
        </Card>

        {/* Security & Privacy */}
        <Card icon={Shield} title="Security & Privacy">
          <Toggle label="Privacy lock" desc="Require re-authentication to open sensitive items." on={toggles.privacyLock} onClick={() => flip('privacyLock')} />
          <div className="mt-2 flex items-center gap-2 rounded-2xl bg-brand/5 p-3 text-xs text-stone-500 dark:text-stone-400">
            <Lock className="h-4 w-4 shrink-0 text-brand" />
            {isSupabaseEnabled
              ? 'Your data is protected by Supabase authentication and row-level security.'
              : 'Running in secure demo mode — your data is stored locally on this device.'}
          </div>
        </Card>

        {/* Storage */}
        <Card icon={HardDrive} title="Storage">
          <div className="flex items-end justify-between">
            <p className="text-2xl font-extrabold">{storage.usedGb.toFixed(1)}<span className="text-sm font-semibold text-stone-400"> / {storage.totalGb} GB used</span></p>
            <span className="chip bg-brand/10 text-brand">{storage.percent}%</span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${storage.percent}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => { data.reseed(); toast('Demo data restored', 'success') }} className="btn-ghost">
              <RotateCcw className="h-4 w-4" /> Restore demo data
            </button>
            <button onClick={() => { if (confirm('Delete all vault data? This cannot be undone.')) { data.resetAll(); toast('All data cleared', 'info') } }} className="btn-ghost !text-danger">
              <Trash2 className="h-4 w-4" /> Clear all data
            </button>
          </div>
        </Card>

        <button onClick={handleSignOut} className="btn-ghost w-full !text-danger">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  )
}

function Card({ icon: Icon, title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

function Toggle({ label, desc, on, onClick }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {desc && <p className="text-xs text-stone-500 dark:text-stone-400">{desc}</p>}
      </div>
      <button onClick={onClick} className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? 'bg-brand-gradient' : 'bg-stone-300 dark:bg-white/15'}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  )
}

function ThemeOption({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-4 text-sm font-semibold transition ${active ? 'border-brand bg-brand/10 text-brand' : 'border-stone-200 text-stone-500 hover:border-brand/40 dark:border-white/10 dark:text-stone-300'}`}>
      <Icon className="h-5 w-5" /> {label}
    </button>
  )
}

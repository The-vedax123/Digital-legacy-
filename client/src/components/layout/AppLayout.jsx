import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FolderLock,
  Images,
  Hourglass,
  Users,
  Sparkles,
  HeartPulse,
  Settings,
  Moon,
  Sun,
  Bell,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react'
import Logo from '../Logo'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import AuroraBackground from '../AuroraBackground'

const nav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/vault', label: 'Vault', icon: FolderLock },
  { to: '/app/memories', label: 'Memories', icon: Images },
  { to: '/app/capsules', label: 'Time Capsules', icon: Hourglass },
  { to: '/app/circle', label: 'Trusted Circle', icon: Users },
  { to: '/app/emergency', label: 'Emergency Card', icon: HeartPulse },
  { to: '/app/echo', label: 'AI Assistant', icon: Sparkles },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

const mobileNav = nav.filter((n) => ['/app', '/app/vault', '/app/capsules', '/app/echo', '/app/circle'].includes(n.to))

export default function AppLayout() {
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const initials = (user?.name || 'E V')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 mx-auto flex max-w-[1440px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-2 border-r border-black/5 bg-white/50 p-5 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.02] lg:flex">
          <div className="px-1 py-3">
            <Logo tagline />
          </div>
          <nav className="mt-3 flex flex-1 flex-col gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-gradient text-white shadow-glow'
                      : 'text-stone-600 hover:bg-brand/8 hover:text-brand-700 dark:text-stone-300 dark:hover:bg-white/5'
                  }`
                }
              >
                <item.icon className="h-5 w-5" strokeWidth={2} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Reassurance card */}
          <div className="mt-auto overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-b from-brand/5 to-brand/10 p-4 dark:border-white/5">
            <div className="mb-2 grid h-9 w-9 place-items-center rounded-xl bg-white/70 text-brand-700 shadow-soft dark:bg-white/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-brand-800 dark:text-stone-100">Secure. Private. Yours.</p>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Your data is encrypted and stored securely.</p>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-h-screen w-full flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/5 bg-canvas/70 px-4 py-3 backdrop-blur-xl dark:border-white/5 dark:bg-ink/60 sm:px-6">
            <div className="lg:hidden">
              <Logo size="sm" />
            </div>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="btn-ghost h-10 w-10 !px-0" title="Toggle theme">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className="btn-ghost relative h-10 w-10 !px-0" title="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger" />
              </button>
              <button onClick={handleSignOut} className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white py-1.5 pl-1.5 pr-2 transition hover:bg-stone-50 dark:border-white/10 dark:bg-white/5" title="Account · sign out">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white">{initials}</span>
                <span className="hidden text-sm font-semibold sm:block">{user?.name}</span>
                <ChevronDown className="hidden h-4 w-4 text-stone-400 sm:block" />
              </button>
            </div>
          </header>

          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:pb-10"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/85 px-2 py-1.5 backdrop-blur-2xl dark:border-white/5 dark:bg-ink/85 lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between">
          {mobileNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-semibold transition ${
                  isActive ? 'text-brand-700' : 'text-stone-500 dark:text-stone-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`grid h-9 w-9 place-items-center rounded-xl transition ${isActive ? 'bg-brand-gradient text-white shadow-glow' : ''}`}>
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  {item.label === 'Time Capsules' ? 'Capsules' : item.label === 'Trusted Circle' ? 'Circle' : item.label === 'AI Assistant' ? 'Echo' : item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

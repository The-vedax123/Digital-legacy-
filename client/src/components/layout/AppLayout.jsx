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
  LogOut,
  Moon,
  Sun,
} from 'lucide-react'
import Logo from '../Logo'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import AuroraBackground from '../AuroraBackground'

const nav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/vault', label: 'Vault', icon: FolderLock },
  { to: '/app/memories', label: 'Memories', icon: Images },
  { to: '/app/capsules', label: 'Capsules', icon: Hourglass },
  { to: '/app/circle', label: 'Circle', icon: Users },
  { to: '/app/echo', label: 'Echo AI', icon: Sparkles },
  { to: '/app/emergency', label: 'Emergency', icon: HeartPulse },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

// Primary items shown in the mobile bottom bar
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
      <div className="relative z-10 mx-auto flex max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-2 border-r border-slate-200/60 p-5 dark:border-white/5 lg:flex">
          <div className="px-1 py-3">
            <Logo />
          </div>
          <nav className="mt-2 flex flex-1 flex-col gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-gradient text-white shadow-glow'
                      : 'text-slate-600 hover:bg-slate-500/10 dark:text-slate-300'
                  }`
                }
              >
                <item.icon className="h-5 w-5" strokeWidth={2} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="glass mt-auto flex items-center gap-3 rounded-2xl p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
            <button onClick={handleSignOut} title="Sign out" className="text-slate-400 hover:text-danger">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-h-screen w-full flex-1 flex-col">
          {/* Top bar (mobile + desktop) */}
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200/50 bg-white/60 px-4 py-3 backdrop-blur-xl dark:border-white/5 dark:bg-ink/50 sm:px-6">
            <div className="lg:hidden">
              <Logo size="sm" />
            </div>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="btn-ghost h-10 w-10 !px-0" title="Toggle theme">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button onClick={handleSignOut} className="btn-ghost h-10 w-10 !px-0 lg:hidden" title="Sign out">
                <LogOut className="h-5 w-5" />
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
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/60 bg-white/80 px-2 py-1.5 backdrop-blur-2xl dark:border-white/5 dark:bg-ink/80 lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between">
          {mobileNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-semibold transition ${
                  isActive ? 'text-brand' : 'text-slate-500 dark:text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`grid h-9 w-9 place-items-center rounded-xl transition ${isActive ? 'bg-brand-gradient text-white shadow-glow' : ''}`}>
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

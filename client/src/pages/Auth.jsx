import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react'
import Logo from '../components/Logo'
import AuroraBackground from '../components/AuroraBackground'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.1 14.6 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c5.9 0 9.8-4.1 9.8-9.9 0-.7-.1-1.2-.2-1.7H12z" />
    <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.6c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6C4.7 19.9 8.1 22 12 22z" />
    <path fill="#4A90D9" d="M6.4 13.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.6H3.1C2.4 9 2 10.4 2 12s.4 3 1.1 4.4l3.3-2.6z" />
    <path fill="#FBBC05" d="M12 6.2c1.5 0 2.5.6 3.1 1.2l2.3-2.3C16 3.8 14.2 3 12 3 8.1 3 4.7 5.1 3.1 8.2l3.3 2.6C7.2 8 9.4 6.2 12 6.2z" />
  </svg>
)

export default function Auth() {
  const [mode, setMode] = useState('signin') // signin | signup | forgot
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const { signIn, signUp, signInWithGoogle, signInDemo, resetPassword, isSupabaseEnabled } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === 'signin') {
        await signIn(form.email, form.password)
        toast('Welcome back to EchoVault', 'success')
        navigate('/app')
      } else if (mode === 'signup') {
        await signUp(form.email, form.password, form.name)
        toast('Your vault is ready', 'success')
        navigate('/app')
      } else if (mode === 'forgot') {
        await resetPassword(form.email)
        toast('Password reset link sent — check your inbox', 'success')
        setMode('signin')
      }
    } catch (err) {
      toast(err.message || 'Something went wrong', 'error')
    } finally {
      setBusy(false)
    }
  }

  const google = async () => {
    setBusy(true)
    try {
      await signInWithGoogle()
      if (!isSupabaseEnabled) {
        toast('Signed in with Google', 'success')
        navigate('/app')
      }
    } catch (err) {
      toast(err.message || 'Google sign-in failed', 'error')
    } finally {
      setBusy(false)
    }
  }

  const demo = async () => {
    setBusy(true)
    try {
      await signInDemo()
      toast('Exploring the EchoVault demo', 'success')
      navigate('/app')
    } catch (err) {
      toast(err.message || 'Could not start demo', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative grid min-h-screen bg-brand-radial lg:grid-cols-2">
      <AuroraBackground />

      {/* Left brand panel (desktop) */}
      <div className="relative z-10 hidden flex-col justify-between p-12 lg:flex">
        <Link to="/"><Logo /></Link>
        <div>
          <ShieldCheck className="h-14 w-14 text-brand" />
          <h2 className="mt-6 max-w-md text-4xl font-extrabold leading-tight">
            Your legacy, <span className="gradient-text">secured for the ones you love.</span>
          </h2>
          <p className="mt-4 max-w-md text-stone-600 dark:text-stone-300">
            Documents, memories, wishes and time capsules — all protected in one beautiful, private vault.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
          <Sparkles className="h-4 w-4 text-brand" /> Powered by Echo AI & built for the Cursor Mobilethon
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative z-10 flex items-center justify-center p-5 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong w-full max-w-md rounded-3xl p-7 sm:p-9">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link to="/" className="lg:hidden"><Logo size="sm" /></Link>
            <Link
              to="/"
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <h1 className="text-2xl font-extrabold">
                {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your vault' : 'Reset password'}
              </h1>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                {mode === 'signin'
                  ? 'Sign in to access your digital legacy.'
                  : mode === 'signup'
                    ? 'Start protecting what matters most.'
                    : 'We’ll send you a link to reset your password.'}
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                {mode === 'signup' && (
                  <Field icon={User} label="Full name" type="text" value={form.name} onChange={set('name')} placeholder="Alex Okafor" required />
                )}
                <Field icon={Mail} label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
                {mode !== 'forgot' && (
                  <Field icon={Lock} label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required minLength={mode === 'signup' ? 6 : undefined} />
                )}

                {mode === 'signin' && (
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setMode('forgot')} className="text-xs font-semibold text-brand hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button type="submit" disabled={busy} className="btn-primary w-full text-base">
                  {busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Vault' : 'Send Reset Link'}
                  {!busy && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              {mode !== 'forgot' ? (
                <>
                  <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase text-stone-400">
                    <span className="h-px flex-1 bg-stone-200 dark:bg-white/10" /> or <span className="h-px flex-1 bg-stone-200 dark:bg-white/10" />
                  </div>
                  <div className="space-y-2.5">
                    <button onClick={google} disabled={busy} className="btn-ghost w-full">
                      <GoogleIcon /> Continue with Google
                    </button>
                    <button onClick={demo} disabled={busy} className="btn-soft w-full">
                      <Sparkles className="h-4 w-4" /> Explore the live demo
                    </button>
                  </div>
                  <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
                    {mode === 'signin' ? "Don't have a vault?" : 'Already have a vault?'}{' '}
                    <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="font-bold text-brand hover:underline">
                      {mode === 'signin' ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </>
              ) : (
                <button onClick={() => setMode('signin')} className="mt-5 flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
                  <ArrowLeft className="h-4 w-4" /> Back to sign in
                </button>
              )}
            </motion.div>
          </AnimatePresence>

          {!isSupabaseEnabled && (
            <p className="mt-6 rounded-2xl bg-brand/5 px-4 py-3 text-center text-xs text-stone-500 dark:text-stone-400">
              <b>Demo mode.</b> Sign in with any email &amp; password to enter instantly — your vault is saved on this device.
              Add Supabase keys for real cloud accounts across devices.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -transtone-y-1/2 text-stone-400" />
        <input {...props} className="input pl-11" />
      </div>
    </div>
  )
}

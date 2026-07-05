import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  ShieldCheck,
  Lock,
  Hourglass,
  Sparkles,
  FolderLock,
  Images,
  Users,
  HeartPulse,
  ChevronDown,
  Star,
  ArrowRight,
  Fingerprint,
  KeyRound,
  ServerCog,
} from 'lucide-react'
import Logo from '../components/Logo'
import AuroraBackground from '../components/AuroraBackground'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

const features = [
  { icon: FolderLock, title: 'Digital Vault', desc: 'Encrypted storage for passports, insurance, property, crypto keys and every document that matters.' },
  { icon: Images, title: 'Memory Vault', desc: 'Preserve photos, videos, voice notes and letters — with AI-generated summaries of your story.' },
  { icon: Hourglass, title: 'Time Capsules', desc: 'Write messages for the future. Delivered on a birthday, an anniversary, or after graduation.' },
  { icon: Users, title: 'Trusted Circle', desc: 'Grant the right people the right access — family, lawyers, or business partners.' },
  { icon: HeartPulse, title: 'Emergency Card', desc: 'Blood group, allergies, medication and contacts — one scan away when seconds count.' },
  { icon: Sparkles, title: 'Echo AI', desc: 'Ask “Where is my passport?” or “What expires next year?” and get an instant, natural answer.' },
]

const testimonials = [
  { name: 'Amara O.', role: 'Mother of two', quote: 'For the first time, I know my family will never be lost if something happens to me. This is peace of mind.' },
  { name: 'David M.', role: 'Founder', quote: 'My business credentials, contracts and crypto keys — finally organized and inheritable. Genius.' },
  { name: ' Layla K.', role: 'Daughter', quote: 'The time capsule my dad left me made me cry. EchoVault is so much more than storage.' },
]

const faqs = [
  { q: 'Is my data secure?', a: 'Yes. EchoVault is built security-first with encrypted storage, granular access controls and row-level protection. You decide exactly who can see what, and when.' },
  { q: 'What is a Time Capsule?', a: 'A private message — text, photos, video or voice — sealed until a moment you choose: a birthday, an anniversary, a graduation, or a manual unlock.' },
  { q: 'Who can access my vault?', a: 'Only the people in your Trusted Circle, each with a permission level you assign: Viewer, Family, Lawyer, Business Partner, or Administrator.' },
  { q: 'How does Echo AI work?', a: 'Echo uses Google Gemini to understand natural questions about your vault and answer instantly — finding documents, tracking expiries and summarizing memories.' },
  { q: 'Do I need to install anything?', a: 'No. EchoVault is a mobile-first web app that works beautifully on any device. Just open it and start protecting what matters.' },
]

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} className="btn-ghost h-10 w-10 !px-0" title="Toggle theme">
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-radial">
      <AuroraBackground />

      {/* Nav */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
          <a href="#features" className="hover:text-brand">Features</a>
          <a href="#security" className="hover:text-brand">Security</a>
          <a href="#capsule" className="hover:text-brand">Time Capsule</a>
          <a href="#ai" className="hover:text-brand">AI</a>
          <a href="#faq" className="hover:text-brand">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/auth" className="btn-primary !py-2.5">Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-10 text-center sm:pt-16">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-semibold text-brand">
          <Sparkles className="h-3.5 w-3.5" /> Built for the Cursor Mobilethon
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl"
        >
          Protect Your <span className="gradient-text">Digital Life.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mx-auto mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg"
        >
          Store your important documents, memories and wishes securely so the people who matter most are never left in the dark.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link to="/auth" className="btn-primary w-full text-base sm:w-auto">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#features" className="btn-ghost w-full text-base sm:w-auto">Learn More</a>
        </motion.div>

        {/* Floating preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="glass-strong mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl p-1.5"
        >
          <div className="rounded-[1.4rem] bg-gradient-to-b from-slate-50 to-white p-5 dark:from-slate-900 dark:to-ink sm:p-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: FolderLock, label: 'Documents', value: '24', color: 'text-brand' },
                { icon: Images, label: 'Memories', value: '58', color: 'text-violet2-400' },
                { icon: Hourglass, label: 'Capsules', value: '3', color: 'text-warning' },
                { icon: Users, label: 'Trusted', value: '5', color: 'text-success' },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4 text-left">
                  <s.icon className={`h-6 w-6 ${s.color}`} />
                  <p className="mt-3 text-2xl font-extrabold">{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-brand-gradient p-4 text-left text-white">
              <Sparkles className="h-6 w-6 shrink-0" />
              <p className="text-sm font-medium">“Your passport expires in 240 days. Want me to remind you before renewal?” — Echo AI</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <Section id="features" eyebrow="Everything in one vault" title="A home for your entire digital legacy">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="glass card-hover rounded-3xl p-6"
            >
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section id="security" eyebrow="Security first" title="Guarded like the most precious thing you own">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Lock, title: 'Encrypted storage', desc: 'Every file is stored in secure, access-controlled storage. Your keys, your rules.' },
            { icon: Fingerprint, title: 'Granular access', desc: 'Decide exactly who sees what with role-based permissions across your Trusted Circle.' },
            { icon: ServerCog, title: 'Built on Supabase', desc: 'Row-level security and modern auth protect your data at every layer.' },
          ].map((s, i) => (
            <motion.div key={s.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} className="glass rounded-3xl p-6">
              <s.icon className="h-8 w-8 text-brand" />
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Time Capsule spotlight */}
      <Section id="capsule" eyebrow="The emotional centerpiece" title="Send a message across time">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-strong overflow-hidden rounded-3xl">
          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
                <Hourglass className="h-3.5 w-3.5" /> Digital Time Capsule
              </div>
              <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">Words that arrive exactly when they’re needed.</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                “Happy 18th Birthday.” “Open after graduation.” “For my future child.” “For my wife on our anniversary.” Seal a moment today and let EchoVault deliver it on the perfect day.
              </p>
              <Link to="/auth" className="btn-primary mt-6 inline-flex">Create your first capsule <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="glass rounded-3xl p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Unlocks in</p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[{ v: '1,096', l: 'Days' }, { v: '14', l: 'Hrs' }, { v: '32', l: 'Min' }, { v: '08', l: 'Sec' }].map((c) => (
                  <div key={c.l} className="rounded-2xl bg-brand-gradient p-3 text-white">
                    <p className="text-xl font-extrabold">{c.v}</p>
                    <p className="text-[10px] uppercase opacity-80">{c.l}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm font-semibold">“Happy 18th Birthday, Zara” 🎂</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">A letter, photos & a voice note — sealed with love.</p>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* AI */}
      <Section id="ai" eyebrow="Meet Echo AI" title="Your legacy, one question away">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass rounded-3xl p-6 sm:p-8">
          <div className="mx-auto max-w-2xl space-y-3">
            {['Where is my passport?', 'Show my business documents', 'What expires next year?', 'Summarize my memories'].map((q, i) => (
              <div key={q} className={`flex ${i % 2 ? 'justify-start' : 'justify-end'}`}>
                <div className={`${i % 2 ? 'glass' : 'bg-brand-gradient text-white'} max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-medium`}>
                  {i % 2 ? (
                    <span>
                      <KeyRound className="mr-1.5 inline h-3.5 w-3.5" /> Found it — “{['Home Insurance', 'International Passport', 'Title Deed', 'Wedding Day'][i]}” in your vault.
                    </span>
                  ) : (
                    q
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Testimonials */}
      <Section eyebrow="Loved by families & founders" title="Peace of mind, in their words">
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} className="glass rounded-3xl p-6 text-left">
              <div className="flex gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">“{t.quote}”</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="Questions & answers" title="Everything you might be wondering">
        <div className="mx-auto max-w-2xl space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="glass overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold"
              >
                {f.q}
                <ChevronDown className={`h-5 w-5 shrink-0 transition ${openFaq === i ? 'rotate-180 text-brand' : 'text-slate-400'}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-slate-500 dark:text-slate-400">{f.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 py-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-strong rounded-3xl bg-brand-gradient p-10 text-center text-white">
          <ShieldCheck className="mx-auto h-12 w-12" />
          <h2 className="mt-4 text-3xl font-extrabold">Don’t leave them in the dark.</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">Start your vault today. It only takes a minute to protect a lifetime.</p>
          <Link to="/auth" className="btn mt-6 inline-flex bg-white text-brand hover:bg-white/90">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 dark:border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 dark:text-slate-400 sm:flex-row">
          <Logo size="sm" />
          <p>© {new Date().getFullYear()} EchoVault. Built with love for the Cursor Mobilethon.</p>
          <div className="flex gap-5 font-semibold">
            <a href="#security" className="hover:text-brand">Security</a>
            <a href="#faq" className="hover:text-brand">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="relative z-10 mx-auto max-w-6xl px-5 py-16">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-brand">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2>
      </motion.div>
      {children}
    </section>
  )
}

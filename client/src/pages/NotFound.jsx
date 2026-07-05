import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import Logo from '../components/Logo'
import AuroraBackground from '../components/AuroraBackground'

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center bg-brand-radial px-6 text-center">
      <AuroraBackground />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <Logo className="justify-center" size="lg" />
        <div className="mx-auto mt-8 grid h-20 w-20 place-items-center rounded-3xl bg-brand-gradient shadow-glow">
          <Compass className="h-10 w-10 text-white" />
        </div>
        <h1 className="mt-6 text-5xl font-extrabold">404</h1>
        <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">This page has drifted beyond your vault. Let’s get you back home.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Back to safety</Link>
      </motion.div>
    </div>
  )
}

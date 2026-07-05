import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass flex flex-col items-center justify-center rounded-3xl px-6 py-16 text-center"
    >
      <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-brand-gradient/10">
        <div className="grid h-full w-full place-items-center rounded-3xl bg-brand/10">
          {Icon && <Icon className="h-9 w-9 text-brand" strokeWidth={1.8} />}
        </div>
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}

import { cn } from '../lib/utils'

function TreeMark({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* canopy */}
      <path
        d="M24 7c-5 0-8.5 3.2-9.2 6.9C11.4 15 9 18 9 21.6c0 2.5 1.3 4.7 3.3 6-.5.9-.8 1.9-.8 3 0 3.7 3.2 6.4 7.2 6.4h10.6c4 0 7.2-2.7 7.2-6.4 0-1.1-.3-2.1-.8-3 2-1.3 3.3-3.5 3.3-6 0-3.6-2.4-6.6-5.8-7.7C39.5 10.2 36 7 31 7c-1.3 0-2.5.3-3.6.8A8.9 8.9 0 0 0 24 7Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      {/* trunk */}
      <path d="M22.4 33h3.2v9h-3.2z" fill="#5b3f2a" />
      {/* subtle inner leaf lines */}
      <path d="M24 15v18M24 22l-4-3M24 26l4-3" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function Logo({ className, showText = true, size = 'md', tagline = false }) {
  const dim = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-14 w-14' : 'h-11 w-11'
  const text = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn('grid shrink-0 place-items-center rounded-2xl text-brand-800 shadow-soft', dim)}
        style={{ backgroundImage: 'linear-gradient(150deg, #cdd6a6 0%, #9fb277 55%, #7f9a5f 100%)' }}
      >
        <TreeMark className="h-2/3 w-2/3" />
      </div>
      {showText && (
        <div className="leading-none">
          <span className={cn('font-display font-semibold tracking-tight text-brand-800 dark:text-stone-100', text)}>
            Echo<span className="text-brand-600 dark:text-brand-300">Vault</span>
          </span>
          {tagline && <p className="mt-1 text-[11px] font-medium tracking-wide text-stone-500 dark:text-stone-400">Your legacy. Protected.</p>}
        </div>
      )}
    </div>
  )
}

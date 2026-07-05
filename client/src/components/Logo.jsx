import { ShieldCheck } from 'lucide-react'
import { cn } from '../lib/utils'

export default function Logo({ className, showText = true, size = 'md' }) {
  const dim = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'
  const text = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className={cn('grid place-items-center rounded-2xl bg-brand-gradient shadow-glow', dim)}>
        <ShieldCheck className="h-1/2 w-1/2 text-white" strokeWidth={2.4} />
      </div>
      {showText && (
        <span className={cn('font-display font-extrabold tracking-tight', text)}>
          Echo<span className="gradient-text">Vault</span>
        </span>
      )}
    </div>
  )
}

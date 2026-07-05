import { formatDistanceToNow, differenceInSeconds } from 'date-fns'

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const timeAgo = (dateStr) => {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch {
    return ''
  }
}

export const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

/** Returns countdown parts until a target date. */
export function getCountdown(target) {
  const total = differenceInSeconds(new Date(target), new Date())
  if (total <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return { done: false, days, hours, minutes, seconds }
}

export const DOC_CATEGORIES = [
  'Passport',
  'National ID',
  'Insurance',
  'Property Documents',
  'Business Documents',
  'Certificates',
  'Medical Records',
  'Crypto Information',
  'Personal Documents',
]

export const IMPORTANCE_LEVELS = ['Low', 'Medium', 'High', 'Critical']

export const MEMORY_TYPES = ['photo', 'video', 'voice', 'letter', 'story', 'achievement']

export const PERMISSION_LEVELS = ['Viewer', 'Family', 'Lawyer', 'Business Partner', 'Administrator']

export const CAPSULE_UNLOCK = [
  { value: 'years5', label: 'Open in 5 years' },
  { value: 'birthday', label: 'Open on birthday' },
  { value: 'anniversary', label: 'Open on anniversary' },
  { value: 'graduation', label: 'Open after graduation' },
  { value: 'manual', label: 'Open manually' },
]

export const importanceColor = (level) =>
  ({
    Low: 'bg-stone-500/15 text-stone-500 dark:text-stone-300',
    Medium: 'bg-brand/15 text-brand dark:text-brand-300',
    High: 'bg-warning/15 text-warning',
    Critical: 'bg-danger/15 text-danger',
  }[level] || 'bg-stone-500/15 text-stone-500')

export const permissionColor = (level) =>
  ({
    Viewer: 'bg-stone-500/15 text-stone-500 dark:text-stone-300',
    Family: 'bg-success/15 text-success',
    Lawyer: 'bg-brand/15 text-brand dark:text-brand-300',
    'Business Partner': 'bg-warning/15 text-warning',
    Administrator: 'bg-lav/15 text-lav',
  }[level] || 'bg-stone-500/15 text-stone-500')

/** Rough storage estimate for the demo dashboard. */
export function estimateStorage(data) {
  const docs = data.documents.length * 2.4
  const mems = data.memories.length * 8.1
  const caps = data.capsules.length * 12.5
  const usedGb = +(docs + mems + caps).toFixed(1) / 100
  const totalGb = 5
  return { usedGb: Math.min(usedGb, totalGb), totalGb, percent: Math.min(100, Math.round((usedGb / totalGb) * 100)) }
}

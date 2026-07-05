/** A soft, decorative sparkline used under dashboard stat cards. */
export default function Sparkline({ color = '#6f8f68', data, className = '' }) {
  const points = data || [8, 12, 9, 16, 13, 20, 17, 24]
  const w = 120
  const h = 32
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const step = w / (points.length - 1)

  const coords = points.map((p, i) => [i * step, h - ((p - min) / range) * (h - 6) - 3])

  // Smooth path using simple midpoint curves
  let d = `M ${coords[0][0]},${coords[0][1]}`
  for (let i = 1; i < coords.length; i++) {
    const [x0, y0] = coords[i - 1]
    const [x1, y1] = coords[i]
    const mx = (x0 + x1) / 2
    d += ` Q ${x0},${y0} ${mx},${(y0 + y1) / 2} T ${x1},${y1}`
  }

  const gradId = `spark-${color.replace('#', '')}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={`h-8 w-full ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w},${h} L 0,${h} Z`} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

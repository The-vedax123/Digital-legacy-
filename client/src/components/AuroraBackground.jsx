export default function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="animate-float" style={{ top: '-10%', left: '-5%', width: 420, height: 420, background: '#2563EB' }} />
      <span
        className="animate-float"
        style={{ top: '20%', right: '-10%', width: 480, height: 480, background: '#7C3AED', animationDelay: '2s' }}
      />
      <span
        className="animate-float"
        style={{ bottom: '-15%', left: '20%', width: 380, height: 380, background: '#22C55E', animationDelay: '4s', opacity: 0.25 }}
      />
    </div>
  )
}

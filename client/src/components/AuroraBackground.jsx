export default function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="animate-float" style={{ top: '-12%', left: '-6%', width: 440, height: 440, background: '#9fb277' }} />
      <span
        className="animate-float"
        style={{ top: '18%', right: '-12%', width: 500, height: 500, background: '#c9b98a', animationDelay: '2.5s' }}
      />
      <span
        className="animate-float"
        style={{ bottom: '-16%', left: '22%', width: 400, height: 400, background: '#6f8f68', animationDelay: '5s' }}
      />
    </div>
  )
}

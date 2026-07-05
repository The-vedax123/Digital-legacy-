/** A calm, watercolor-style tree illustration — the emotional heart of the dashboard. */
export default function TreeScene({ className = '' }) {
  return (
    <svg viewBox="0 0 320 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="halo" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#eef3e6" />
          <stop offset="100%" stopColor="#eef3e6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="canopy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9cb87f" />
          <stop offset="100%" stopColor="#6f8f5e" />
        </linearGradient>
        <linearGradient id="canopy2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b7cc98" />
          <stop offset="100%" stopColor="#88a56f" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="130" r="140" fill="url(#halo)" />

      {/* ground */}
      <ellipse cx="160" cy="262" rx="120" ry="16" fill="#dfe6cf" />

      {/* trunk */}
      <path d="M150 262c0-40 2-70 6-96 2-14 2-24 4-40h0c2 16 2 26 4 40 4 26 6 56 6 96z" fill="#7a5636" />
      <path d="M160 150c8 8 16 10 26 8M160 176c-8 6-16 6-26 2M160 200c8 6 18 6 26 2" stroke="#6a4a2e" strokeWidth="3" strokeLinecap="round" />

      {/* canopy clusters */}
      <circle cx="160" cy="92" r="66" fill="url(#canopy)" />
      <circle cx="112" cy="118" r="44" fill="url(#canopy2)" />
      <circle cx="208" cy="118" r="46" fill="url(#canopy2)" />
      <circle cx="132" cy="76" r="40" fill="url(#canopy)" opacity="0.9" />
      <circle cx="192" cy="80" r="42" fill="url(#canopy)" opacity="0.9" />
      <circle cx="160" cy="120" r="52" fill="url(#canopy2)" opacity="0.85" />

      {/* little leaves floating */}
      <path d="M250 70c6-4 14-2 16 4-6 3-13 1-16-4z" fill="#9cb87f" />
      <path d="M64 96c-6-3-8-11-3-15 4 5 5 11 3 15z" fill="#b7cc98" />
      <path d="M232 168c5 3 6 10 2 14-4-4-5-10-2-14z" fill="#88a56f" />
    </svg>
  )
}

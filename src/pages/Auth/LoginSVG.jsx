export default function LoginSVG() {
  return (
    <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="funnelTier1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="funnelTier2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="funnelTier3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
        </linearGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <style>{`
          @keyframes floatIn { 0%{opacity:0;transform:translateY(-18px)} 55%{opacity:1;transform:translateY(0)} 80%{opacity:1} 100%{opacity:0;transform:translateY(12px)} }
          @keyframes dashFlow { to { stroke-dashoffset: -20; } }
          @keyframes stagePulse { 0%,100%{opacity:0.35} 50%{opacity:0.95} }
          @keyframes funnelGlow { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
          .la{animation:floatIn 3s ease-in-out 0.0s infinite}
          .lb{animation:floatIn 3s ease-in-out 0.55s infinite}
          .lc{animation:floatIn 3s ease-in-out 1.1s infinite}
          .ld{animation:floatIn 3s ease-in-out 1.65s infinite}
          .le{animation:floatIn 3s ease-in-out 2.2s infinite}
          .flow{stroke-dasharray:6 4;animation:dashFlow 1.2s linear infinite}
          .s1{animation:stagePulse 2.6s ease-in-out 0.0s infinite}
          .s2{animation:stagePulse 2.6s ease-in-out 0.65s infinite}
          .s3{animation:stagePulse 2.6s ease-in-out 1.3s infinite}
          .s4{animation:stagePulse 2.6s ease-in-out 1.95s infinite}
          .funnel-rim { animation: funnelGlow 3s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Orbit Rings backing */}
      <circle cx="150" cy="100" r="76" stroke="white" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.12" />
      <circle cx="150" cy="100" r="54" stroke="white" strokeWidth="0.5" opacity="0.08" />

      {/* CRM Funnel Structure */}
      {/* Tier 1 - Ingest */}
      <path d="M85 50 L98 80 H202 L215 50 Z" fill="url(#funnelTier1)" stroke="white" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
      <ellipse cx="150" cy="50" rx="65" ry="7" stroke="white" strokeWidth="1.2" className="funnel-rim" opacity="0.75" fill="rgba(255,255,255,0.06)" />
      <text x="150" y="68" textAnchor="middle" fill="white" fontSize="6.5" fontFamily="sans-serif" letterSpacing="1" opacity="0.5">LEAD INGEST</text>

      {/* Tier 2 - Nurture */}
      <path d="M98 80 L114 110 H186 L202 80 Z" fill="url(#funnelTier2)" stroke="white" strokeWidth="0.8" opacity="0.4" />
      <line x1="98" y1="80" x2="202" y2="80" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <text x="150" y="98" textAnchor="middle" fill="white" fontSize="6.5" fontFamily="sans-serif" letterSpacing="1" opacity="0.6">NURTURE</text>

      {/* Tier 3 - Convert */}
      <path d="M114 110 L130 140 H170 L186 110 Z" fill="url(#funnelTier3)" stroke="white" strokeWidth="0.8" opacity="0.5" />
      <line x1="114" y1="110" x2="186" y2="110" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="150" cy="140" rx="20" ry="3" stroke="white" strokeWidth="1.2" opacity="0.8" fill="rgba(56, 189, 248, 0.2)" />
      <text x="150" y="128" textAnchor="middle" fill="white" fontSize="6.5" fontFamily="sans-serif" letterSpacing="1" fontWeight="600" opacity="0.85">CONVERT</text>

      {/* Lead Particles filtering through funnel */}
      <g className="la">
        <circle cx="150" cy="42" r="3.5" fill="white" filter="url(#glow)" />
      </g>
      <g className="lb">
        <circle cx="118" cy="62" r="3" fill="#818cf8" opacity="0.9" />
      </g>
      <g className="lc">
        <circle cx="182" cy="62" r="3" fill="#a5b4fc" opacity="0.9" />
      </g>
      <g className="ld">
        <circle cx="134" cy="92" r="2.8" fill="#38bdf8" filter="url(#glow)" />
      </g>
      <g className="le">
        <circle cx="166" cy="92" r="2.8" fill="white" opacity="0.85" />
      </g>
      <g className="la">
        <circle cx="150" cy="122" r="3" fill="#38bdf8" filter="url(#glow)" />
      </g>

      {/* Active Pipeline Flow line out of funnel spout */}
      {/* <line x1="150" y1="143" x2="150" y2="212" stroke="white" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.35" />
      <line x1="150" y1="212" x2="150" y2="244" stroke="white" strokeWidth="2.2" strokeLinecap="round" className="flow" opacity="0.95" /> */}

      {/* Lead Pipeline stages at the bottom */}
      {/* {[
        { x: 14, cls: 's1', lbl: 'Prospect', dim: true },
        { x: 78, cls: 's2', lbl: 'Qualify', dim: true },
        { x: 142, cls: 's3', lbl: 'Convert', dim: false },
        { x: 206, cls: 's4', lbl: 'Retain', dim: true }
      ].map(({ x, cls, lbl, dim }, i) => (
        <g key={lbl}>
          <rect x={x} y={303} width="50" height="15" rx="3"
            fill={dim ? 'rgba(3, 2, 2, 0.1)' : 'rgba(255,255,255,0.22)'}
            stroke="white" strokeWidth={dim ? 0.9 : 1.5}
            className={cls} />
          <text x={x + 25} y={309} textAnchor="middle" fill="white"
            fontSize={dim ? 7 : 7.5} fontFamily="sans-serif"
            fontWeight={dim ? 400 : 600} opacity={dim ? 0.65 : 1}>{lbl}</text>
          {i < 3 && <line x1={x + 50} y1={309} x2={x + 64} y2={309} stroke="white" strokeWidth="0.9" strokeDasharray="2 2" opacity="0.45" />}
        </g>
      ))} */}
    </svg>
  )
}

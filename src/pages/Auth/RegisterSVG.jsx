export default function RegisterSVG() {
  return (
    <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="crmHubGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <style>{`
          @keyframes edgeDraw{from{stroke-dashoffset:90}to{stroke-dashoffset:0}}
          @keyframes nodePop{0%{opacity:0;transform:scale(0)}70%{transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
          @keyframes chartLine{from{stroke-dashoffset:310}to{stroke-dashoffset:0}}
          @keyframes blip{0%,100%{opacity:0.25}50%{opacity:1}}
          .e1{stroke-dasharray:90;animation:edgeDraw .6s 0.15s ease forwards;stroke-dashoffset:90}
          .e2{stroke-dasharray:90;animation:edgeDraw .6s 0.3s ease forwards;stroke-dashoffset:90}
          .e3{stroke-dasharray:90;animation:edgeDraw .6s 0.45s ease forwards;stroke-dashoffset:90}
          .e4{stroke-dasharray:90;animation:edgeDraw .6s 0.6s ease forwards;stroke-dashoffset:90}
          .e5{stroke-dasharray:90;animation:edgeDraw .6s 0.75s ease forwards;stroke-dashoffset:90}
          .e7{stroke-dasharray:90;animation:edgeDraw .8s 0.9s ease forwards;stroke-dashoffset:90}
          .chart-l{stroke-dasharray:310;stroke-dashoffset:310;animation:chartLine 1.3s 1.2s ease forwards}
          .b1{animation:blip 2.2s 1.8s ease-in-out infinite}
          .b2{animation:blip 2.2s 2.3s ease-in-out infinite}
          .b3{animation:blip 2.2s 2.8s ease-in-out infinite}
          .n-hub { animation: nodePop .5s 0s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: 150px 110px; opacity: 0; }
          .n1 { animation: nodePop .5s 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: 85px 70px; opacity: 0; }
          .n2 { animation: nodePop .5s 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: 215px 70px; opacity: 0; }
          .n3 { animation: nodePop .5s 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: 70px 135px; opacity: 0; }
          .n4 { animation: nodePop .5s 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: 230px 135px; opacity: 0; }
          .n5 { animation: nodePop .5s 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: 150px 45px; opacity: 0; }
        `}</style>
      </defs>

      {/* Background radial alignment ring */}
      <circle cx="150" cy="110" r="76" stroke="white" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.12" />

      {/* Network Edge lines (drawing) */}
      <line className="e1" x1="150" y1="110" x2="85" y2="70" stroke="white" strokeWidth="1.5" opacity="0.45" />
      <line className="e2" x1="150" y1="110" x2="215" y2="70" stroke="white" strokeWidth="1.5" opacity="0.45" />
      <line className="e3" x1="150" y1="110" x2="70" y2="135" stroke="white" strokeWidth="1.5" opacity="0.45" />
      <line className="e4" x1="150" y1="110" x2="230" y2="135" stroke="white" strokeWidth="1.5" opacity="0.45" />
      <line className="e5" x1="150" y1="110" x2="150" y2="45" stroke="white" strokeWidth="1.5" opacity="0.45" />

      {/* Downward CRM sync connector to the visual growth stats below */}
      {/* <line className="e7" x1="150" y1="110" x2="150" y2="226" stroke="white" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.5" /> */}

      {/* CRM database center node */}
      <g className="n-hub">
        <circle cx="150" cy="110" r="15" fill="url(#crmHubGrad)" stroke="white" strokeWidth="1.2" filter="url(#glow)" />
        {/* Simplified Vector DB Stack */}
        <path d="M144 104 C144 102.5, 156 102.5, 156 104 C156 105.5, 144 105.5, 144 104" stroke="white" strokeWidth="0.8" fill="none" opacity="0.95" />
        <path d="M144 107.5 V109.5 C144 111, 156 111, 156 109.5 V107.5" stroke="white" strokeWidth="0.8" fill="none" opacity="0.95" />
        <path d="M144 112 V114 C144 115.5, 156 115.5, 156 114 V112" stroke="white" strokeWidth="0.8" fill="none" opacity="0.95" />
        <text x="150" y="133" textAnchor="middle" fill="white" fontSize="6.5" fontFamily="sans-serif" fontWeight="700" letterSpacing="0.5" opacity="0.9">LMS</text>
      </g>

      {/* Channel 1: Web Forms */}
      <g className="n1">
        <circle cx="85" cy="70" r="10" fill="#312e81" stroke="white" strokeWidth="1" filter="url(#glow)" />
        <rect x="80" y="66" width="10" height="8" rx="1.2" fill="none" stroke="white" strokeWidth="0.8" />
        <line x1="83" y1="69" x2="87" y2="69" stroke="white" strokeWidth="0.6" />
        <line x1="83" y1="72" x2="87" y2="72" stroke="white" strokeWidth="0.6" />
        <text x="85" y="87.5" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="sans-serif" letterSpacing="0.8" opacity="0.75">FORMS</text>
      </g>

      {/* Channel 2: Ads */}
      <g className="n2">
        <circle cx="215" cy="70" r="10" fill="#312e81" stroke="white" strokeWidth="1" filter="url(#glow)" />
        <circle cx="215" cy="70" r="4.5" fill="none" stroke="white" strokeWidth="0.8" />
        <circle cx="215" cy="70" r="1.5" fill="#38bdf8" />
        <text x="215" y="87.5" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="sans-serif" letterSpacing="0.8" opacity="0.75">ADS</text>
      </g>

      {/* Channel 3: Social Leads */}
      <g className="n3">
        <circle cx="70" cy="135" r="10" fill="#312e81" stroke="white" strokeWidth="1" filter="url(#glow)" />
        <rect x="64" y="131" width="12" height="8" rx="1.5" fill="none" stroke="white" strokeWidth="0.8" />
        <polygon points="66,139 66,142 69,139" fill="white" stroke="white" strokeWidth="0.2" />
        <text x="70" y="152.5" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="sans-serif" letterSpacing="0.8" opacity="0.75">SOCIAL</text>
      </g>

      {/* Channel 4: Mail Campaigns */}
      <g className="n4">
        <circle cx="230" cy="135" r="10" fill="#312e81" stroke="white" strokeWidth="1" filter="url(#glow)" />
        <rect x="224" y="131" width="12" height="8" rx="1.5" fill="none" stroke="white" strokeWidth="0.8" />
        <path d="M224 131 L230 135 L236 131" stroke="white" strokeWidth="0.8" fill="none" />
        <text x="230" y="152.5" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="sans-serif" letterSpacing="0.8" opacity="0.75">MAIL</text>
      </g>

      {/* Channel 5: Integrations & API */}
      <g className="n5">
        <circle cx="150" cy="45" r="10" fill="#312e81" stroke="white" strokeWidth="1" filter="url(#glow)" />
        <path d="M146 43 L144 45 L146 47" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M154 43 L156 45 L154 47" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <line x1="148" y1="46" x2="152" y2="44" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        <text x="150" y="32" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="sans-serif" letterSpacing="0.8" opacity="0.75">API</text>
      </g>

      {/* Business Growth Glassmorphic Card */}
      <rect x="18" y="226" width="264" height="72" rx="6" fill="rgba(255,255,255,0.06)" stroke="white" strokeWidth="0.7" opacity="0.45" />
      <line x1="28" y1="252" x2="272" y2="252" stroke="white" strokeWidth="0.5" opacity="0.18" />
      <line x1="28" y1="268" x2="272" y2="268" stroke="white" strokeWidth="0.5" opacity="0.18" />

      {/* Bars Chart */}
      {[
        { x: 32, h: 20, o: 0.18 }, { x: 64, h: 30, o: 0.2 }, { x: 96, h: 42, o: 0.22 },
        { x: 128, h: 50, o: 0.22 }, { x: 160, h: 58, o: 0.24 }, { x: 192, h: 64, o: 0.27 },
        { x: 224, h: 70, o: 0.34 }
      ].map(({ x, h, o }, i) => (
        <rect key={i} x={x} y={294 - h} width="22" height={h} rx="2" fill={`rgba(255,255,255,${o})`}
          stroke={i === 6 ? 'white' : 'none'} strokeWidth="1" />
      ))}

      {/* Polyline Trend Line */}
      <polyline className="chart-l"
        points="43,280 75,268 107,254 139,244 171,234 203,226 235,220"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Blip animations */}
      <circle className="b1" cx="139" cy="244" r="3.5" fill="white" />
      <circle className="b2" cx="203" cy="226" r="3.5" fill="white" />
      <circle className="b3" cx="235" cy="220" r="4" fill="white" />

      {/* Arrow Indicator */}
      <path d="M228 216 L237 220 L231 226" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
      <text x="150" y="309" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif" opacity="0.55" letterSpacing="2">BUSINESS GROWTH</text>
    </svg>
  )
}

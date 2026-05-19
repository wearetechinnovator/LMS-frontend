export default function RegisterSVG() {
  return (
    <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <style>{`
          @keyframes edgeDraw{from{stroke-dashoffset:90}to{stroke-dashoffset:0}}
          @keyframes nodePop{0%{opacity:0;transform:scale(0)}70%{transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
          @keyframes chartLine{from{stroke-dashoffset:310}to{stroke-dashoffset:0}}
          @keyframes blip{0%,100%{opacity:0.25}50%{opacity:1}}
          .e1{stroke-dasharray:90;animation:edgeDraw .6s 0.15s ease forwards;stroke-dashoffset:90}
          .e2{stroke-dasharray:90;animation:edgeDraw .6s 0.35s ease forwards;stroke-dashoffset:90}
          .e3{stroke-dasharray:90;animation:edgeDraw .6s 0.55s ease forwards;stroke-dashoffset:90}
          .e4{stroke-dasharray:90;animation:edgeDraw .6s 0.72s ease forwards;stroke-dashoffset:90}
          .e5{stroke-dasharray:90;animation:edgeDraw .6s 0.88s ease forwards;stroke-dashoffset:90}
          .e6{stroke-dasharray:90;animation:edgeDraw .6s 1.02s ease forwards;stroke-dashoffset:90}
          .e7{stroke-dasharray:90;animation:edgeDraw .6s 1.15s ease forwards;stroke-dashoffset:90}
          .chart-l{stroke-dasharray:310;stroke-dashoffset:310;animation:chartLine 1.3s 1.5s ease forwards}
          .b1{animation:blip 2.2s 2.0s ease-in-out infinite}
          .b2{animation:blip 2.2s 2.5s ease-in-out infinite}
          .b3{animation:blip 2.2s 3.0s ease-in-out infinite}
        `}</style>
      </defs>

      <rect x="18" y="226" width="264" height="72" rx="6" fill="rgba(255,255,255,0.06)" stroke="white" strokeWidth="0.7" opacity="0.45"/>
      <line x1="28" y1="252" x2="272" y2="252" stroke="white" strokeWidth="0.5" opacity="0.18"/>
      <line x1="28" y1="268" x2="272" y2="268" stroke="white" strokeWidth="0.5" opacity="0.18"/>
      {[
        {x:32,h:20,o:0.18},{x:64,h:30,o:0.2},{x:96,h:42,o:0.22},
        {x:128,h:50,o:0.22},{x:160,h:58,o:0.24},{x:192,h:64,o:0.27},
        {x:224,h:70,o:0.34}
      ].map(({x,h,o},i) => (
        <rect key={i} x={x} y={294-h} width="22" height={h} rx="2" fill={`rgba(255,255,255,${o})`}
          stroke={i===6 ? 'white' : 'none'} strokeWidth="1"/>
      ))}
      <polyline className="chart-l"
        points="43,280 75,268 107,254 139,244 171,234 203,226 235,220"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle className="b1" cx="139" cy="244" r="3.5" fill="white"/>
      <circle className="b2" cx="203" cy="226" r="3.5" fill="white"/>
      <circle className="b3" cx="235" cy="220" r="4" fill="white"/>
      <path d="M228 216 L237 220 L231 226" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85"/>
      <text x="150" y="309" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif" opacity="0.55" letterSpacing="2">BUSSINESS GROWTH</text>
    </svg>
  )
}

export default function LoginSVG() {
  return (
    <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <style>{`
          @keyframes floatIn { 0%{opacity:0;transform:translateY(-14px)} 55%{opacity:1;transform:translateY(0)} 80%{opacity:1} 100%{opacity:0;transform:translateY(10px)} }
          @keyframes dashFlow { to { stroke-dashoffset: -20; } }
          @keyframes pulseOut { 0%{r:12;opacity:0.5} 100%{r:26;opacity:0} }
          @keyframes stagePulse { 0%,100%{opacity:0.35} 50%{opacity:0.95} }
          .la{animation:floatIn 3s ease-in-out 0.0s infinite}
          .lb{animation:floatIn 3s ease-in-out 0.55s infinite}
          .lc{animation:floatIn 3s ease-in-out 1.1s infinite}
          .ld{animation:floatIn 3s ease-in-out 1.65s infinite}
          .le{animation:floatIn 3s ease-in-out 2.2s infinite}
          .flow{stroke-dasharray:6 4;animation:dashFlow 1.5s linear infinite}
          .pulse{animation:pulseOut 1.8s ease-out infinite}
          .s1{animation:stagePulse 2.6s ease-in-out 0.0s infinite}
          .s2{animation:stagePulse 2.6s ease-in-out 0.65s infinite}
          .s3{animation:stagePulse 2.6s ease-in-out 1.3s infinite}
          .s4{animation:stagePulse 2.6s ease-in-out 1.95s infinite}
        `}</style>
      </defs>

      <line x1="150" y1="212" x2="150" y2="244" stroke="white" strokeWidth="2" strokeLinecap="round" className="flow" opacity="0.9"/>
      {[
        {x:14,cls:'s1',lbl:'Prospect',dim:true},
        {x:78,cls:'s2',lbl:'Qualify',dim:true},
        {x:142,cls:'s3',lbl:'Convert',dim:false},
        {x:206,cls:'s4',lbl:'Retain',dim:true}
      ].map(({x,cls,lbl,dim},i) => (
        <g key={lbl}>
          <rect x={x} y={303} width="50" height="15" rx="3"
            fill={dim ? 'rgba(3, 2, 2, 0.1)' : 'rgba(255,255,255,0.22)'}
            stroke="white" strokeWidth={dim ? 0.9 : 1.5}
            className={cls}/>
          <text x={x+25} y={309} textAnchor="middle" fill="white"
            fontSize={dim ? 7 : 7.5} fontFamily="sans-serif"
            fontWeight={dim ? 400 : 600} opacity={dim ? 0.65 : 1}>{lbl}</text>
          {i < 3 && <line x1={x+50} y1={309} x2={x+64} y2={309} stroke="white" strokeWidth="0.9" strokeDasharray="2 2" opacity="0.45"/>}
        </g>
      ))}
    </svg>
  )
}

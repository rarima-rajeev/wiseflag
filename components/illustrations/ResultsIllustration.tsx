// Eval results: a podium of three models with the judge's scales above.
export default function ResultsIllustration({ className = "" }: { className?: string }) {
  const podium = [
    { x: 70, h: 54, c: "#0D9488", n: "2" },
    { x: 130, h: 84, c: "#1D4ED8", n: "1" },
    { x: 190, h: 44, c: "#C026D3", n: "3" },
  ];
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label="Illustration of three models on a podium, judged by a scale">
      <defs>
        <linearGradient id="res-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#FFFBEB" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" rx="24" fill="url(#res-bg)" />
      <line x1="50" y1="176" x2="270" y2="176" stroke="#CBD5E1" strokeWidth="2" />
      {podium.map((p, i) => (
        <g key={p.n}>
          <rect
            x={p.x}
            y={176 - p.h}
            width="56"
            height={p.h}
            rx="6"
            fill={p.c}
            className="wf-grow"
            style={{ transformOrigin: `${p.x + 28}px 176px`, animationDelay: `${i * 0.15}s` }}
          />
          <text x={p.x + 28} y={176 - p.h + 22} textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">
            {p.n}
          </text>
        </g>
      ))}
      {/* Trophy on the winner */}
      <g className="wf-float">
        <path d="M146 66 h24 v8 q0 14 -12 16 q-12 -2 -12 -16 z" fill="#FBBF24" />
        <rect x="154" y="88" width="8" height="8" fill="#D97706" />
        <rect x="148" y="96" width="20" height="5" rx="2" fill="#D97706" />
      </g>
      {/* Judge's scale */}
      <g className="wf-wave" style={{ transformOrigin: "262px 50px" }}>
        <line x1="262" y1="32" x2="262" y2="70" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
        <line x1="242" y1="38" x2="282" y2="38" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
        <path d="M242 38 L236 52 H248 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
        <path d="M282 38 L276 52 H288 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// Product takeaways: a lightbulb over a decision board with trade-off scales.
export default function TakeawaysIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label="Illustration of a lightbulb above a board of product decisions">
      <defs>
        <linearGradient id="tk-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#FEF9C3" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" rx="24" fill="url(#tk-bg)" />

      {/* Decision board */}
      <rect x="36" y="58" width="132" height="116" rx="12" fill="#fff" stroke="#94A3B8" />
      <text x="50" y="80" fontSize="10" fontWeight="800" fill="#334155" fontFamily="Inter, sans-serif">DECISIONS</text>
      {[96, 118, 140, 162].map((y, i) => (
        <g key={y} className="wf-pop" style={{ animationDelay: `${0.2 + i * 0.25}s`, transformOrigin: `58px ${y}px` }}>
          <circle cx="58" cy={y - 3} r="7" fill={i === 3 ? "#FEF3C7" : "#DCFCE7"} />
          {i === 3 ? (
            <text x="58" y={y + 1} textAnchor="middle" fontSize="10" fontWeight="800" fill="#B45309" fontFamily="Inter, sans-serif">→</text>
          ) : (
            <path d={`M55 ${y - 3} l2.5 2.5 l4 -5`} stroke="#15803D" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <rect x="72" y={y - 6} width={[78, 60, 70, 50][i]} height="6" rx="3" fill="#E2E8F0" />
        </g>
      ))}

      {/* Scale: trade-offs */}
      <g className="wf-wave" style={{ transformOrigin: "236px 120px" }}>
        <line x1="236" y1="96" x2="236" y2="170" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <rect x="216" y="168" width="40" height="8" rx="4" fill="#64748B" />
        <line x1="200" y1="104" x2="272" y2="104" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <path d="M200 104 L190 128 H210 Z" fill="#C7D2FE" stroke="#6366F1" strokeWidth="2" strokeLinejoin="round" />
        <path d="M272 104 L262 128 H282 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
      </g>

      {/* Lightbulb */}
      <g className="wf-float">
        <circle cx="236" cy="54" r="20" fill="#FDE047" />
        <rect x="228" y="72" width="16" height="10" rx="2" fill="#94A3B8" />
        <path d="M230 50 q6 -8 12 0" stroke="#CA8A04" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {[[-30, -6], [30, -6], [0, -32], [-22, -26], [22, -26]].map(([dx, dy], i) => (
          <line key={i} x1={236 + dx * 0.8} y1={54 + dy * 0.8} x2={236 + dx} y2={54 + dy} stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
}

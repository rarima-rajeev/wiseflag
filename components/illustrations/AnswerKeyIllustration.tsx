// The Answer Key: a graded answer sheet with a key.
export default function AnswerKeyIllustration({ className = "" }: { className?: string }) {
  const rows = [
    { y: 74, label: "Age", ok: true },
    { y: 102, label: "Sex", ok: true },
    { y: 130, label: "Symptoms", ok: true },
    { y: 158, label: "Outcome", ok: false },
  ];
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label="Illustration of an answer sheet being checked with a key">
      <defs>
        <linearGradient id="ak-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ECFEFF" />
          <stop offset="1" stopColor="#EEF2FF" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" rx="24" fill="url(#ak-bg)" />

      {/* Clipboard */}
      <rect x="70" y="28" width="150" height="156" rx="14" fill="#fff" stroke="#94A3B8" />
      <rect x="116" y="20" width="58" height="18" rx="6" fill="#64748B" />
      <text x="86" y="58" fontSize="11" fontWeight="800" fill="#0F172A" fontFamily="Inter, sans-serif">ANSWER KEY</text>
      {rows.map((r, i) => (
        <g key={r.label} className="wf-pop" style={{ animationDelay: `${0.2 + i * 0.3}s`, transformOrigin: `96px ${r.y}px` }}>
          <circle cx="96" cy={r.y} r="9" fill={r.ok ? "#DCFCE7" : "#FEF3C7"} />
          {r.ok ? (
            <path d={`M92 ${r.y} l3 3 l5 -6`} fill="none" stroke="#15803D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <text x="96" y={r.y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#B45309" fontFamily="Inter, sans-serif">?</text>
          )}
          <text x="112" y={r.y + 4} fontSize="11" fontWeight="600" fill="#334155" fontFamily="Inter, sans-serif">{r.label}</text>
          <rect x="170" y={r.y - 3} width="36" height="6" rx="3" fill="#E2E8F0" />
        </g>
      ))}

      {/* Key */}
      <g className="wf-wave" style={{ transformOrigin: "250px 120px" }}>
        <circle cx="252" cy="96" r="20" fill="none" stroke="#E89F3C" strokeWidth="8" />
        <rect x="248" y="114" width="8" height="58" rx="3" fill="#E89F3C" />
        <rect x="256" y="148" width="14" height="7" rx="2" fill="#E89F3C" />
        <rect x="256" y="162" width="10" height="7" rx="2" fill="#E89F3C" />
      </g>
    </svg>
  );
}

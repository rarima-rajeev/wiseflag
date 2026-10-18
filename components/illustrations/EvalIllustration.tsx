// Decorative illustration: an AI summary checked line-by-line against the source report.
export default function EvalIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      role="img"
      aria-label="Illustration of an AI summary being checked against the original report"
    >
      <defs>
        <linearGradient id="eval-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#FFF7ED" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" rx="24" fill="url(#eval-bg)" />

      {/* Source report */}
      <g>
        <rect x="30" y="36" width="100" height="128" rx="10" fill="#fff" stroke="#94A3B8" />
        <text x="44" y="56" fontSize="10" fontWeight="700" fill="#475569" fontFamily="Inter, sans-serif">
          REPORT
        </text>
        {[68, 82, 96, 110, 124, 138].map((y, i) => (
          <rect key={y} x="44" y={y} width={i % 3 === 2 ? 46 : 72} height="5" rx="2.5" fill="#E2E8F0" />
        ))}
      </g>

      {/* Arrow */}
      <path d="M140 100 H172" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 5" className="wf-dash" />
      <path d="M170 93 L180 100 L170 107" fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* AI summary with checks */}
      <g>
        <rect x="190" y="36" width="100" height="128" rx="10" fill="#fff" stroke="#6366F1" />
        <g className="wf-sparkle" style={{ transformOrigin: "272px 52px" }}>
          <path d="M272 42 L275 50 L283 52 L275 55 L272 63 L269 55 L261 52 L269 50 Z" fill="#6366F1" />
        </g>
        <text x="204" y="56" fontSize="10" fontWeight="700" fill="#4338CA" fontFamily="Inter, sans-serif">
          AI
        </text>
        {[
          { y: 74, ok: true },
          { y: 100, ok: true },
          { y: 126, ok: false },
        ].map((row, i) => (
          <g key={row.y} className="wf-pop" style={{ animationDelay: `${0.4 + i * 0.35}s`, transformOrigin: `211px ${row.y + 4}px` }}>
            <circle cx="211" cy={row.y + 4} r="8" fill={row.ok ? "#DCFCE7" : "#FFE4E6"} />
            {row.ok ? (
              <path d={`M207 ${row.y + 4} l3 3 l5 -6`} fill="none" stroke="#15803D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d={`M208 ${row.y + 1} l6 6 M214 ${row.y + 1} l-6 6`} stroke="#BE123C" strokeWidth="2.2" strokeLinecap="round" />
            )}
            <rect x="224" y={row.y + 1} width={row.ok ? 52 : 44} height="6" rx="3" fill={row.ok ? "#E2E8F0" : "#FECDD3"} />
          </g>
        ))}
      </g>
    </svg>
  );
}

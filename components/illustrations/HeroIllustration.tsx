// Landing hero: reports -> statistics flag one -> AI explains -> a person decides.
export default function HeroIllustration({ className = "" }: { className?: string }) {
  const font = "Inter, sans-serif";
  return (
    <svg
      viewBox="0 0 720 240"
      className={className}
      role="img"
      aria-label="Reports flow into a statistics chart that flags one pattern, an AI explains it, and a person approves it"
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF2FF" />
          <stop offset="0.6" stopColor="#F5F3FF" />
          <stop offset="1" stopColor="#ECFEFF" />
        </linearGradient>
        <filter id="hero-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#312E81" floodOpacity="0.10" />
        </filter>
      </defs>
      <rect x="0" y="0" width="720" height="240" rx="28" fill="url(#hero-bg)" />

      {/* Dotted path connecting the stages */}
      <path
        d="M150 128 C 190 128, 200 128, 236 128 M 380 128 C 410 128, 420 128, 452 128 M 584 128 C 600 128, 606 128, 614 128"
        stroke="#A5B4FC"
        strokeWidth="3"
        strokeDasharray="5 7"
        strokeLinecap="round"
        fill="none"
        className="wf-dash"
      />

      {/* 1. Reports */}
      <g className="wf-float" filter="url(#hero-shadow)">
        <rect x="44" y="70" width="92" height="112" rx="12" fill="#fff" stroke="#CBD5E1" transform="rotate(-7 90 126)" />
        <rect x="50" y="64" width="92" height="112" rx="12" fill="#fff" stroke="#94A3B8" />
        <rect x="64" y="80" width="38" height="7" rx="3.5" fill="#6366F1" />
        {[96, 108, 120, 132, 144, 156].map((y, i) => (
          <rect key={y} x="64" y={y} width={i % 2 ? 48 : 64} height="5" rx="2.5" fill="#E2E8F0" />
        ))}
      </g>
      <text x="96" y="214" textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155" fontFamily={font}>
        890,836 rows
      </text>

      {/* 2. Statistics */}
      <g filter="url(#hero-shadow)">
        <rect x="244" y="62" width="128" height="120" rx="14" fill="#fff" stroke="#C7D2FE" />
      </g>
      <line x1="260" y1="162" x2="356" y2="162" stroke="#E2E8F0" strokeWidth="2" />
      {[
        { x: 266, h: 26 },
        { x: 284, h: 38 },
        { x: 302, h: 20 },
        { x: 320, h: 78, hot: true },
        { x: 338, h: 32 },
      ].map((b) => (
        <rect
          key={b.x}
          x={b.x}
          y={162 - b.h}
          width="12"
          height={b.h}
          rx="3"
          fill={b.hot ? "#4F46E5" : "#C7D2FE"}
          className={b.hot ? "wf-grow" : undefined}
          style={b.hot ? { transformOrigin: `${b.x + 6}px 162px` } : undefined}
        />
      ))}
      <g className="wf-wave" style={{ transformOrigin: "326px 84px" }}>
        <line x1="326" y1="84" x2="326" y2="66" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        <path d="M326 66 L342 70 L326 75 Z" fill="#E89F3C" />
      </g>
      <text x="308" y="214" textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155" fontFamily={font}>
        Statistics find it
      </text>

      {/* 3. AI explains */}
      <g filter="url(#hero-shadow)">
        <rect x="460" y="70" width="120" height="96" rx="16" fill="#4F46E5" />
        <path d="M486 166 L480 184 L502 166 Z" fill="#4F46E5" />
      </g>
      <g className="wf-sparkle" style={{ transformOrigin: "556px 92px" }}>
        <path d="M556 82 L559 89 L566 92 L559 95 L556 102 L553 95 L546 92 L553 89 Z" fill="#FDE68A" />
      </g>
      {[104, 120, 136].map((y, i) => (
        <rect key={y} x="478" y={y} width={[78, 64, 44][i]} height="7" rx="3.5" fill="#fff" fillOpacity={0.85 - i * 0.15} />
      ))}
      <text x="520" y="214" textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155" fontFamily={font}>
        AI explains it
      </text>

      {/* 4. Human decides */}
      <g filter="url(#hero-shadow)">
        <circle cx="660" cy="100" r="22" fill="#FDE68A" />
        <path d="M624 168 C 624 138, 696 138, 696 168 Z" fill="#0E7490" />
      </g>
      <circle cx="652" cy="98" r="2.5" fill="#334155" />
      <circle cx="668" cy="98" r="2.5" fill="#334155" />
      <path d="M653 108 Q660 113 667 108" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
      <g className="wf-pop" style={{ animationDelay: "0.8s", transformOrigin: "688px 76px" }}>
        <circle cx="688" cy="76" r="12" fill="#22C55E" />
        <path d="M682 76 l4 4 l7 -8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="660" y="214" textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155" fontFamily={font}>
        A human decides
      </text>
    </svg>
  );
}

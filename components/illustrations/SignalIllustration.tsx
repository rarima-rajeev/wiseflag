// Decorative illustration: a pile of reports, a chart, and a magnifier spotting the outlier.
export default function SignalIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      role="img"
      aria-label="Illustration of reports being scanned for an unusual pattern"
    >
      <defs>
        <linearGradient id="sig-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#ECFEFF" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" rx="24" fill="url(#sig-bg)" />

      {/* Stack of report cards */}
      <g className="wf-float">
        <rect x="26" y="62" width="88" height="108" rx="10" fill="#fff" stroke="#CBD5E1" transform="rotate(-8 70 116)" />
        <rect x="32" y="56" width="88" height="108" rx="10" fill="#fff" stroke="#CBD5E1" transform="rotate(-3 76 110)" />
        <rect x="38" y="50" width="88" height="108" rx="10" fill="#fff" stroke="#94A3B8" />
        <rect x="50" y="64" width="40" height="6" rx="3" fill="#6366F1" />
        {[80, 92, 104, 116, 128, 140].map((y, i) => (
          <rect key={y} x="50" y={y} width={i % 2 ? 50 : 64} height="4" rx="2" fill="#E2E8F0" />
        ))}
      </g>

      {/* Bar chart with one standout bar */}
      <g>
        <line x1="150" y1="160" x2="290" y2="160" stroke="#CBD5E1" strokeWidth="2" />
        {[
          { x: 160, h: 34 },
          { x: 184, h: 48 },
          { x: 208, h: 28 },
          { x: 232, h: 104, hot: true },
          { x: 256, h: 40 },
        ].map((b) => (
          <rect
            key={b.x}
            x={b.x}
            y={160 - b.h}
            width="16"
            height={b.h}
            rx="4"
            fill={b.hot ? "#4F46E5" : "#C7D2FE"}
            className={b.hot ? "wf-grow" : undefined}
            style={b.hot ? { transformOrigin: `${b.x + 8}px 160px` } : undefined}
          />
        ))}
        {/* Flag on the standout bar */}
        <g className="wf-wave" style={{ transformOrigin: "240px 56px" }}>
          <line x1="240" y1="56" x2="240" y2="34" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <path d="M240 34 L258 39 L240 45 Z" fill="#E89F3C" />
        </g>
      </g>

      {/* Magnifier */}
      <g className="wf-scan">
        <circle cx="176" cy="88" r="22" fill="#ffffff" fillOpacity="0.55" stroke="#0F172A" strokeWidth="4" />
        <line x1="192" y1="104" x2="206" y2="118" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

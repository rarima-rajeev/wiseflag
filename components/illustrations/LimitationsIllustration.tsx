// Limitations: a magnifier over a report with gaps and question marks, plus a caution sign.
export default function LimitationsIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label="Illustration of a report with missing pieces and a caution sign">
      <defs>
        <linearGradient id="lim-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF7ED" />
          <stop offset="1" stopColor="#EEF2FF" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" rx="24" fill="url(#lim-bg)" />

      {/* Report with gaps */}
      <rect x="40" y="34" width="120" height="140" rx="12" fill="#fff" stroke="#94A3B8" />
      {[
        { y: 56, w: 80 },
        { y: 74, w: 40, gap: true },
        { y: 92, w: 88 },
        { y: 110, w: 56, gap: true },
        { y: 128, w: 72 },
        { y: 146, w: 30, gap: true },
      ].map((r) =>
        r.gap ? (
          <rect key={r.y} x="56" y={r.y} width="88" height="7" rx="3.5" fill="none" stroke="#CBD5E1" strokeDasharray="4 4" />
        ) : (
          <rect key={r.y} x="56" y={r.y} width={r.w} height="7" rx="3.5" fill="#E2E8F0" />
        )
      )}

      {/* Floating question marks */}
      {[
        { x: 176, y: 60, d: "0s" },
        { x: 150, y: 168, d: "0.8s" },
        { x: 30, y: 30, d: "1.6s" },
      ].map((q) => (
        <text key={q.x} x={q.x} y={q.y} fontSize="22" fontWeight="800" fill="#A5B4FC" fontFamily="Inter, sans-serif" className="wf-float" style={{ animationDelay: q.d }}>
          ?
        </text>
      ))}

      {/* Magnifier */}
      <g className="wf-scan" style={{ animationDuration: "6s" }}>
        <circle cx="110" cy="96" r="26" fill="#fff" fillOpacity="0.4" stroke="#0F172A" strokeWidth="4" />
        <line x1="129" y1="115" x2="146" y2="132" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* Caution sign */}
      <g className="wf-wave" style={{ transformOrigin: "250px 170px" }}>
        <rect x="246" y="120" width="8" height="52" rx="3" fill="#64748B" />
        <path d="M250 56 L292 128 H208 Z" fill="#E89F3C" stroke="#B45309" strokeWidth="3" strokeLinejoin="round" />
        <rect x="246" y="80" width="8" height="26" rx="3" fill="#451A03" />
        <circle cx="250" cy="115" r="4.5" fill="#451A03" />
      </g>
    </svg>
  );
}

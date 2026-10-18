// About: an info badge beside a stacked set of project pages.
export default function AboutIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label="Illustration of an information badge next to project pages">
      <defs>
        <linearGradient id="ab-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1F5F9" />
          <stop offset="1" stopColor="#EEF2FF" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" rx="24" fill="url(#ab-bg)" />
      <g className="wf-float">
        <circle cx="100" cy="100" r="46" fill="#fff" stroke="#6366F1" strokeWidth="4" />
        <circle cx="100" cy="78" r="6" fill="#4F46E5" />
        <rect x="94" y="92" width="12" height="34" rx="4" fill="#4F46E5" />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} className="wf-pop" style={{ animationDelay: `${0.2 + i * 0.2}s`, transformOrigin: `${210 + i * 10}px ${100 - i * 8}px` }}>
          <rect x={180 + i * 14} y={52 + i * 12} width="78" height="96" rx="10" fill="#fff" stroke="#94A3B8" />
          {[0, 1, 2, 3].map((r) => (
            <rect key={r} x={192 + i * 14} y={70 + i * 12 + r * 16} width={r % 2 ? 40 : 54} height="6" rx="3" fill="#E2E8F0" />
          ))}
        </g>
      ))}
    </svg>
  );
}

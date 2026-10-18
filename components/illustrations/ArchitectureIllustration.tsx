// System architecture: connected building blocks with data flowing through them.
export default function ArchitectureIllustration({ className = "" }: { className?: string }) {
  const nodes = [
    { x: 40, y: 40, c: "#94A3B8", l: "DATA" },
    { x: 130, y: 40, c: "#0891B2", l: "STATS" },
    { x: 220, y: 40, c: "#4F46E5", l: "AI" },
    { x: 220, y: 120, c: "#F59E0B", l: "JUDGE" },
    { x: 130, y: 120, c: "#059669", l: "HUMAN" },
    { x: 40, y: 120, c: "#7C3AED", l: "SITE" },
  ];
  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
  ];
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label="Illustration of connected system blocks: data, statistics, AI, judge, human review and site">
      <defs>
        <linearGradient id="arch-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#F0FDFA" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" rx="24" fill="url(#arch-bg)" />
      {links.map(([a, b]) => {
        const A = nodes[a];
        const B = nodes[b];
        return (
          <line
            key={`${a}-${b}`}
            x1={A.x + 30}
            y1={A.y + 20}
            x2={B.x + 30}
            y2={B.y + 20}
            stroke="#A5B4FC"
            strokeWidth="3"
            strokeDasharray="5 6"
            strokeLinecap="round"
            className="wf-dash"
          />
        );
      })}
      {nodes.map((n, i) => (
        <g key={n.l} className="wf-pop" style={{ animationDelay: `${i * 0.15}s`, transformOrigin: `${n.x + 30}px ${n.y + 20}px` }}>
          <rect x={n.x} y={n.y} width="60" height="40" rx="10" fill="#fff" stroke={n.c} strokeWidth="2.5" />
          <circle cx={n.x + 14} cy={n.y + 20} r="5" fill={n.c} />
          <text x={n.x + 24} y={n.y + 24} fontSize="9" fontWeight="800" fill="#334155" fontFamily="Inter, sans-serif">
            {n.l}
          </text>
        </g>
      ))}
      {/* Shield for security */}
      <g className="wf-float">
        <path d="M290 44 L306 50 V64 Q306 76 290 82 Q274 76 274 64 V50 Z" fill="#0F172A" />
        <path d="M283 63 l5 5 l9 -10" stroke="#6EE7B7" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// How It Works: a funnel narrowing hundreds of thousands of reports down to one human decision at a time.
const STAGES = [
  { value: "890,836", label: "data rows in the raw file", width: 360, fill: "#EEF2FF", text: "#3730A3" },
  { value: "632,708", label: "unique reports after merging", width: 300, fill: "#E0E7FF", text: "#3730A3" },
  { value: "150", label: "patterns flagged by statistics", width: 240, fill: "#A5B4FC", text: "#1E1B4B" },
  { value: "3–5", label: "reports the AI sums up per flag", width: 175, fill: "#6366F1", text: "#ffffff" },
  { value: "1", label: "person approves or rejects", width: 110, fill: "#0E7490", text: "#ffffff" },
];

export default function FunnelIllustration({ className = "" }: { className?: string }) {
  const cx = 190;
  return (
    <svg
      viewBox="0 0 600 304"
      className={className}
      role="img"
      aria-label="Funnel: 890,836 data rows become 632,708 unique reports, 150 patterns are flagged, the AI sums up 3 to 5 reports per flag, and one person decides"
    >
      <rect x="0" y="0" width="600" height="304" rx="24" fill="#F8FAFF" />
      {STAGES.map((s, i) => {
        const y = 22 + i * 54;
        const next = STAGES[i + 1]?.width ?? s.width - 30;
        return (
          <g key={s.label} className="wf-pop" style={{ animationDelay: `${i * 0.18}s`, transformOrigin: `${cx}px ${y + 22}px` }}>
            <path
              d={`M${cx - s.width / 2} ${y} H${cx + s.width / 2} L${cx + next / 2} ${y + 46} H${cx - next / 2} Z`}
              fill={s.fill}
            />
            <text x={cx} y={y + 29} textAnchor="middle" fontSize="17" fontWeight="800" fill={s.text} fontFamily="Inter, sans-serif">
              {s.value}
            </text>
            <line x1={cx + s.width / 2 + 4} y1={y + 23} x2={cx + s.width / 2 + 18} y2={y + 23} stroke="#CBD5E1" strokeWidth="2" />
            <text x={cx + s.width / 2 + 24} y={y + 28} fontSize="14" fontWeight="600" fill="#334155" fontFamily="Inter, sans-serif">
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

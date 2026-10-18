// Human review: a safety officer at a desk with the AI draft, choosing approve or reject.
export default function HumanReviewIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label="Illustration of a safety officer reviewing an AI summary and approving it">
      <defs>
        <linearGradient id="hr-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ECFEFF" />
          <stop offset="1" stopColor="#EEF2FF" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" rx="24" fill="url(#hr-bg)" />

      {/* AI draft card */}
      <g className="wf-float">
        <rect x="150" y="30" width="130" height="96" rx="12" fill="#fff" stroke="#6366F1" />
        <path d="M262 40 L264.5 46 L270.5 48 L264.5 50 L262 56 L259.5 50 L253.5 48 L259.5 46 Z" fill="#6366F1" />
        <text x="164" y="50" fontSize="10" fontWeight="800" fill="#4338CA" fontFamily="Inter, sans-serif">AI DRAFT</text>
        {[64, 78, 92, 106].map((y, i) => (
          <rect key={y} x="164" y={y} width={[96, 80, 88, 60][i]} height="6" rx="3" fill={i === 3 ? "#FECDD3" : "#E2E8F0"} />
        ))}
      </g>

      {/* Person */}
      <circle cx="84" cy="78" r="22" fill="#FDE68A" />
      <path d="M62 72 Q84 50 106 72 L106 66 Q84 44 62 66 Z" fill="#334155" />
      <circle cx="77" cy="80" r="2.5" fill="#334155" />
      <circle cx="91" cy="80" r="2.5" fill="#334155" />
      <path d="M78 89 Q84 93 90 89" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M44 150 C 44 112, 124 112, 124 150 Z" fill="#0E7490" />

      {/* Desk */}
      <rect x="24" y="148" width="272" height="12" rx="4" fill="#94A3B8" />

      {/* Decision buttons */}
      <g className="wf-pop" style={{ animationDelay: "0.5s", transformOrigin: "190px 140px" }}>
        <rect x="150" y="132" width="58" height="16" rx="8" fill="#22C55E" />
        <text x="179" y="143.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">APPROVE</text>
      </g>
      <g className="wf-pop" style={{ animationDelay: "0.8s", transformOrigin: "250px 140px" }}>
        <rect x="222" y="132" width="58" height="16" rx="8" fill="#fff" stroke="#F43F5E" />
        <text x="251" y="143.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#E11D48" fontFamily="Inter, sans-serif">REJECT</text>
      </g>

      {/* Magnifier over the suspicious line */}
      <g className="wf-scan" style={{ animationDuration: "6s" }}>
        <circle cx="196" cy="108" r="14" fill="#fff" fillOpacity="0.35" stroke="#0F172A" strokeWidth="3" />
        <line x1="206" y1="118" x2="216" y2="128" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

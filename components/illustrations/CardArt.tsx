// Small decorative banner for each landing card. Purely visual; the card text carries the meaning.
const BG: Record<string, [string, string]> = {
  "/how-it-works": ["#EEF2FF", "#ECFEFF"],
  "/flagged-symptoms": ["#EEF2FF", "#F5F3FF"],
  "/human-review": ["#ECFEFF", "#EEF2FF"],
  "/answer-key": ["#ECFEFF", "#F0FDF4"],
  "/evals": ["#F5F3FF", "#FFF7ED"],
  "/limitations": ["#FFF7ED", "#FEF2F2"],
  "/product-decisions": ["#EEF2FF", "#FEF9C3"],
  "/architecture": ["#EEF2FF", "#F0FDFA"],
  "/eval-results": ["#EEF2FF", "#FFFBEB"],
  "/about": ["#F1F5F9", "#EEF2FF"],
};

function Scene({ link }: { link: string }) {
  switch (link) {
    case "/how-it-works":
      return (
        <g>
          {[
            { x: 40, c: "#94A3B8" },
            { x: 120, c: "#6366F1" },
            { x: 200, c: "#0E7490" },
          ].map((n, i) => (
            <g key={n.x}>
              <circle cx={n.x} cy="55" r="20" fill="#fff" stroke={n.c} strokeWidth="3" />
              <circle cx={n.x} cy="55" r="7" fill={n.c} className="wf-pop" style={{ animationDelay: `${i * 0.3}s`, transformOrigin: `${n.x}px 55px` }} />
              {i < 2 && <path d={`M${n.x + 26} 55 H${n.x + 54}`} stroke="#A5B4FC" strokeWidth="3" strokeDasharray="4 5" className="wf-dash" />}
            </g>
          ))}
        </g>
      );
    case "/flagged-symptoms":
      return (
        <g>
          <line x1="40" y1="90" x2="200" y2="90" stroke="#CBD5E1" strokeWidth="2" />
          {[22, 34, 18, 62, 28, 40].map((h, i) => (
            <rect key={i} x={50 + i * 25} y={90 - h} width="14" height={h} rx="3" fill={i === 3 ? "#4F46E5" : "#C7D2FE"} />
          ))}
          <g className="wf-wave" style={{ transformOrigin: "132px 28px" }}>
            <line x1="132" y1="28" x2="132" y2="12" stroke="#334155" strokeWidth="2" />
            <path d="M132 12 L146 16 L132 20 Z" fill="#E89F3C" />
          </g>
        </g>
      );
    case "/human-review":
      return (
        <g>
          <rect x="44" y="22" width="92" height="66" rx="8" fill="#fff" stroke="#6366F1" />
          {[38, 52, 66].map((y, i) => (
            <rect key={y} x="56" y={y} width={[64, 52, 40][i]} height="6" rx="3" fill={i === 2 ? "#FECDD3" : "#E2E8F0"} />
          ))}
          <circle cx="180" cy="44" r="14" fill="#FDE68A" />
          <path d="M156 92 C 156 66, 204 66, 204 92 Z" fill="#0E7490" />
          <g className="wf-pop" style={{ animationDelay: "0.4s", transformOrigin: "200px 30px" }}>
            <circle cx="200" cy="30" r="9" fill="#22C55E" />
            <path d="M196 30 l3 3 l5 -6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      );
    case "/answer-key":
      return (
        <g>
          <rect x="80" y="12" width="80" height="86" rx="8" fill="#fff" stroke="#94A3B8" />
          {[30, 50, 70].map((y, i) => (
            <g key={y}>
              <circle cx="96" cy={y} r="6" fill="#DCFCE7" />
              <path d={`M93 ${y} l2 2 l4 -4`} stroke="#15803D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <rect x="108" y={y - 3} width={[38, 30, 42][i]} height="6" rx="3" fill="#E2E8F0" />
            </g>
          ))}
          <g className="wf-float">
            <circle cx="186" cy="40" r="12" fill="none" stroke="#E89F3C" strokeWidth="5" />
            <rect x="183" y="50" width="6" height="36" rx="2" fill="#E89F3C" />
            <rect x="189" y="72" width="8" height="5" rx="1.5" fill="#E89F3C" />
          </g>
        </g>
      );
    case "/evals":
      return (
        <g>
          {[
            { y: 30, w: 120, c: "#6366F1" },
            { y: 55, w: 90, c: "#A5B4FC" },
            { y: 80, w: 60, c: "#C7D2FE" },
          ].map((b, i) => (
            <g key={b.y}>
              <rect x="50" y={b.y - 7} width="140" height="14" rx="7" fill="#fff" />
              <rect x="50" y={b.y - 7} width={b.w} height="14" rx="7" fill={b.c} className="wf-grow" style={{ transformOrigin: `50px ${b.y}px`, animationName: "wf-grow-x", animationDelay: `${i * 0.2}s` }} />
            </g>
          ))}
          <g className="wf-sparkle" style={{ transformOrigin: "212px 28px" }}>
            <path d="M212 18 L215 25 L222 28 L215 31 L212 38 L209 31 L202 28 L209 25 Z" fill="#6366F1" />
          </g>
        </g>
      );
    case "/limitations":
      return (
        <g>
          <rect x="56" y="16" width="70" height="80" rx="8" fill="#fff" stroke="#94A3B8" />
          {[32, 48, 64, 80].map((y, i) => (
            <rect key={y} x="66" y={y} width="50" height="6" rx="3" fill={i % 2 ? "none" : "#E2E8F0"} stroke={i % 2 ? "#CBD5E1" : "none"} strokeDasharray="3 3" />
          ))}
          <g className="wf-wave" style={{ transformOrigin: "170px 90px" }}>
            <rect x="167" y="62" width="6" height="30" rx="2" fill="#64748B" />
            <path d="M170 20 L198 66 H142 Z" fill="#E89F3C" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
            <rect x="167" y="36" width="6" height="16" rx="2" fill="#451A03" />
            <circle cx="170" cy="58" r="3" fill="#451A03" />
          </g>
        </g>
      );
    case "/architecture":
      return (
        <g>
          {[
            { x: 30, y: 20, c: "#94A3B8" },
            { x: 95, y: 20, c: "#0891B2" },
            { x: 160, y: 20, c: "#4F46E5" },
            { x: 160, y: 66, c: "#F59E0B" },
            { x: 95, y: 66, c: "#059669" },
            { x: 30, y: 66, c: "#7C3AED" },
          ].map((n, i, arr) => (
            <g key={i}>
              {i < arr.length - 1 && (
                <line x1={n.x + 25} y1={n.y + 12} x2={arr[i + 1].x + 25} y2={arr[i + 1].y + 12} stroke="#A5B4FC" strokeWidth="2.5" strokeDasharray="4 5" className="wf-dash" />
              )}
              <rect x={n.x} y={n.y} width="50" height="24" rx="6" fill="#fff" stroke={n.c} strokeWidth="2" />
              <circle cx={n.x + 12} cy={n.y + 12} r="4" fill={n.c} />
            </g>
          ))}
        </g>
      );
    case "/eval-results":
      return (
        <g>
          <line x1="50" y1="96" x2="190" y2="96" stroke="#CBD5E1" strokeWidth="2" />
          {[
            { x: 66, h: 34, c: "#0D9488" },
            { x: 104, h: 56, c: "#1D4ED8" },
            { x: 142, h: 26, c: "#C026D3" },
          ].map((b) => (
            <rect key={b.x} x={b.x} y={96 - b.h} width="32" height={b.h} rx="4" fill={b.c} />
          ))}
          <g className="wf-float">
            <path d="M112 18 h16 v6 q0 10 -8 12 q-8 -2 -8 -12 z" fill="#FBBF24" />
            <rect x="117" y="35" width="6" height="5" fill="#D97706" />
          </g>
        </g>
      );
    case "/about":
      return (
        <g>
          <circle cx="120" cy="55" r="30" fill="#fff" stroke="#6366F1" strokeWidth="3" />
          <circle cx="120" cy="42" r="4" fill="#4F46E5" />
          <rect x="116" y="51" width="8" height="22" rx="3" fill="#4F46E5" />
          <g className="wf-float">
            <rect x="170" y="30" width="40" height="50" rx="6" fill="#fff" stroke="#94A3B8" />
            {[42, 52, 62].map((y) => (
              <rect key={y} x="178" y={y} width="24" height="4" rx="2" fill="#E2E8F0" />
            ))}
          </g>
        </g>
      );
    case "/product-decisions":
      return (
        <g>
          <g className="wf-float">
            <circle cx="120" cy="46" r="18" fill="#FDE047" />
            <rect x="113" y="62" width="14" height="9" rx="2" fill="#94A3B8" />
            {[[-26, 0], [26, 0], [0, -26], [-19, -19], [19, -19]].map(([dx, dy], i) => (
              <line key={i} x1={120 + dx * 0.8} y1={46 + dy * 0.8} x2={120 + dx} y2={46 + dy} stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
            ))}
          </g>
          {[60, 180].map((x, i) => (
            <g key={x}>
              <rect x={x - 22} y="78" width="44" height="22" rx="6" fill="#fff" stroke={i ? "#D97706" : "#6366F1"} />
              <rect x={x - 14} y="86" width="28" height="6" rx="3" fill={i ? "#FDE68A" : "#C7D2FE"} />
            </g>
          ))}
        </g>
      );
    default:
      return null;
  }
}

export default function CardArt({ link }: { link: string }) {
  const [from, to] = BG[link] ?? ["#F1F5F9", "#F8FAFC"];
  // Gradient lives on the element so it fills the box at any height; the scene scales to fit.
  return (
    <svg
      viewBox="0 0 240 110"
      className="w-full h-28 lg:h-32 block"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
      focusable="false"
    >
      <Scene link={link} />
    </svg>
  );
}

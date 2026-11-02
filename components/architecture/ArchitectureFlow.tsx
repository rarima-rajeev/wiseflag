import Link from "next/link";
import { Code2, Sigma, UserCheck, ShieldCheck, FileSpreadsheet, BarChart3 } from "lucide-react";
import { LOGOS, type Logo } from "@/components/architecture/logos";

export type IconSpec = { logo: Logo } | { lucide: typeof Code2; color: string };

export interface FlowNode {
  label: string;
  sub?: string;
  icons: IconSpec[];
  tone?: "default" | "judge" | "human" | "stats" | "ai";
}

export const L = (slug: keyof typeof LOGOS): IconSpec => ({ logo: LOGOS[slug] });

// Very light brand colors (e.g. DuckDB yellow) get a dark tile so they stay visible.
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 200;
}

export function Icon({ spec }: { spec: IconSpec }) {
  if ("logo" in spec) {
    const dark = isLight(spec.logo.hex);
    return (
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${dark ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200"}`}
        title={spec.logo.title}
      >
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" role="img" aria-label={spec.logo.title}>
          <path d={spec.logo.path} fill={spec.logo.hex} />
        </svg>
      </span>
    );
  }
  const Lucide = spec.lucide;
  return (
    <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white border border-slate-200">
      <Lucide className="w-[18px] h-[18px]" style={{ color: spec.color }} aria-hidden="true" />
    </span>
  );
}

const TONE: Record<NonNullable<FlowNode["tone"]>, string> = {
  default: "bg-white border-slate-200",
  stats: "bg-cyan-50/60 border-cyan-200",
  judge: "bg-amber-50 border-amber-300",
  human: "bg-emerald-50/70 border-emerald-200",
  ai: "bg-indigo-50/70 border-indigo-200",
};

export function Box({ node }: { node: FlowNode }) {
  return (
    <div className={`flex-1 min-w-0 p-3 rounded-xl border-2 ${TONE[node.tone ?? "default"]}`}>
      <div className="flex flex-wrap gap-1.5">
        {node.icons.map((ic, i) => (
          <Icon key={i} spec={ic} />
        ))}
      </div>
      <p className="mt-2 text-sm font-bold text-slate-900 leading-tight">{node.label}</p>
      {node.sub && <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{node.sub}</p>}
    </div>
  );
}

export function Arrow({ left = false }: { left?: boolean }) {
  return (
    <div className="flex items-center justify-center text-slate-300 shrink-0 py-0.5 md:py-0 md:px-0.5" aria-hidden="true">
      <svg viewBox="0 0 24 24" className={`w-5 h-5 rotate-90 ${left ? "md:rotate-180" : "md:rotate-0"}`}>
        <path d="M4 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Empty desktop slots that keep a shorter row's boxes lined up under the four-box row above.
function Slots({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="contents">
          <div className="hidden md:block flex-1" />
          <div className="hidden md:block w-6 shrink-0" />
        </div>
      ))}
    </>
  );
}

function Lane({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div className="flex flex-col md:flex-row md:items-stretch">
      {nodes.map((n, i) => (
        <div key={n.label} className="contents">
          <Box node={n} />
          {i < nodes.length - 1 && <Arrow />}
        </div>
      ))}
    </div>
  );
}

// Second row of a snake layout: drawn right to left on desktop, so its first node sits under the last
// node of the row above. On phones everything stacks top to bottom in flow order.
function ReturnLane({ nodes, columns }: { nodes: FlowNode[]; columns: number }) {
  const rtl = [...nodes].reverse();
  return (
    <div className="flex flex-col-reverse md:flex-row md:items-stretch">
      <Slots count={columns - nodes.length} />
      {rtl.map((n, i) => (
        <div key={n.label} className="contents">
          <Box node={n} />
          {i < rtl.length - 1 && <Arrow left />}
        </div>
      ))}
    </div>
  );
}

export function DownArrow({ label, column }: { label: string; column?: { at: number; of: number } }) {
  const arrow = (
    <div className="flex items-center justify-center gap-2 py-1.5 text-slate-400 flex-1" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path d="M12 4v14m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[11px] font-medium">{label}</span>
    </div>
  );
  if (!column) return arrow;
  return (
    <div className="flex">
      <Slots count={column.at - 1} />
      {arrow}
      <Slots count={column.of - column.at} />
    </div>
  );
}

const DATA_ROW: FlowNode[] = [
  { label: "Kaggle VAERS dataset", sub: "890,836 rows · 1 GB · Jan–Nov 2021", icons: [L("kaggle"), { lucide: FileSpreadsheet, color: "#0F766E" }] },
  { label: "Clean & merge", sub: "632,708 unique reports", icons: [L("python"), L("duckdb")] },
  {
    label: "Statistics engine",
    sub: "2×2 tables · PRR · ROR + 95% CI · Yates χ² · Evans criteria (PRR ≥ 2, χ² ≥ 4, n ≥ 30)",
    icons: [{ lucide: Sigma, color: "#0E7490" }],
    tone: "stats",
  },
  { label: "150 flagged signals", sub: "Ranked by χ², no AI involved", icons: [{ lucide: BarChart3, color: "#4F46E5" }] },
];

const REVIEW_ROW: FlowNode[] = [
  {
    label: "AI summary · Gemini 3.8 Flash",
    sub: "Reads the reports behind each signal and writes a short summary, citing a report number on every sentence",
    icons: [L("googlegemini")],
    tone: "ai",
  },
  {
    label: "Human-in-the-loop",
    sub: "A drug safety officer approves, edits or rejects every AI summary",
    icons: [{ lucide: UserCheck, color: "#047857" }],
    tone: "human",
  },
];

export default function ArchitectureFlow() {
  return (
    <section aria-label="Architecture diagram" className="w-full text-left">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Architecture at a glance</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          From a raw CSV to a decision a person signs off. Statistics find, AI explains, a human decides.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50/80 border border-slate-200 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">In the product: what runs</p>
        <Lane nodes={DATA_ROW} />
        <DownArrow label="reports behind each signal" column={{ at: DATA_ROW.length, of: DATA_ROW.length }} />
        <ReturnLane nodes={REVIEW_ROW} columns={DATA_ROW.length} />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        How Gemini 3.8 Flash was chosen is covered on the{" "}
        <Link href="/eval-results" className="font-semibold text-indigo-700 hover:underline">
          Eval Results
        </Link>{" "}
        page.
      </p>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Built with AI coding tools</p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 text-sm text-slate-700">
              <Icon spec={{ lucide: Code2, color: "#4285F4" }} /> Antigravity
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-slate-700">
              <Icon spec={L("claude")} /> Claude
            </span>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 text-white p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 mb-1.5">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Security across every layer
          </p>
          <p className="text-xs text-slate-200 leading-relaxed">
            API key server-side only · git-ignored · per-key spending cap · no keys on the public site · public, de-identified
            data only
          </p>
        </div>
      </div>
    </section>
  );
}

import { ListChecks, ClipboardCheck, Trophy } from "lucide-react";
import { Arrow, Box, DownArrow, Icon, L, type FlowNode } from "@/components/architecture/ArchitectureFlow";
import results from "@/data/eval-results.json";

const NAMES: Record<string, string> = {
  "google/gemini-3.8-flash": "Gemini 3.8 Flash",
  "meta-llama/llama-3.3-70b-instruct": "Llama 3.3 70B",
  "nvidia/nemotron-3-super-120b-a12b:free": "Nemotron 3 Super",
};

const INPUTS: FlowNode = {
  label: "Test inputs",
  sub: `${results.signalsEvaluated} signals + ${results.goldenTotal} test reports`,
  icons: [{ lucide: ListChecks, color: "#475569" }],
};

const CANDIDATES: FlowNode = {
  label: "3 candidate LLMs",
  sub: "Gemini, Llama and Nemotron, called through OpenRouter",
  icons: [L("googlegemini"), L("meta"), L("nvidia"), L("openrouter")],
  tone: "ai",
};

const JUDGE: FlowNode = {
  label: "Blind judge · Claude Sonnet 5.5",
  sub: "Checks every summary sentence against the report it cites",
  icons: [L("anthropic")],
  tone: "judge",
};

const GOLDEN: FlowNode = {
  label: "Golden set",
  sub: `${results.goldenTotal} hand-verified reports score field extraction`,
  icons: [{ lucide: ClipboardCheck, color: "#047857" }],
  tone: "human",
};

// The offline eval that picked the product's model. Runs once; not part of the live flow.
export default function ModelSelectionFlow() {
  const rows = [...results.models].sort((a, b) => a.summaries.unsupportedRatePct - b.summaries.unsupportedRatePct);
  const [best] = rows;

  return (
    <section aria-label="How the model was chosen" className="w-full text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">How the model was chosen</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">Run once, offline. Not part of the live flow.</p>

      <div className="mt-4 rounded-2xl bg-slate-50/80 border border-slate-200 p-3">
        <div className="flex flex-col md:flex-row md:items-center">
          <Box node={INPUTS} />
          <Arrow />
          <Box node={CANDIDATES} />
          <Arrow />
          <div className="flex-1 min-w-0 rounded-xl border-2 border-dashed border-slate-300 p-2 flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Scoring</p>
            <Box node={JUDGE} />
            <Box node={GOLDEN} />
          </div>
        </div>

        <DownArrow label="results" />

        <div className="rounded-xl border-2 border-slate-200 bg-white p-3 flex items-start gap-3">
          <Icon spec={{ lucide: Trophy, color: "#B45309" }} />
          <div>
            <p className="text-sm font-bold text-slate-900">
              Winner: {NAMES[best.model]}, with {best.summaries.unsupportedRatePct}% made-up claims
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              vs {rows
                .slice(1)
                .map((m) => `${m.summaries.unsupportedRatePct}% for ${NAMES[m.model]}`)
                .join(" and ")}
              . Ranked by fewest made-up claims, a rule set before the run. The full scorecard is below.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

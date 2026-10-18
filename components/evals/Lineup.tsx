import { Bot, Gavel, EyeOff, Building2, Ruler, ListChecks } from "lucide-react";
import results from "@/data/eval-results.json";

const CONTESTANTS = [
  {
    model: "google/gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    company: "Google",
    color: "#1D4ED8",
    blurb: "Google's fast, low-cost model, built for high-volume work like summarizing reports.",
  },
  {
    model: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    company: "Meta",
    color: "#0D9488",
    blurb: "A widely used open model that companies can host themselves, popular for keeping data in-house.",
  },
  {
    model: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron 3 Super",
    company: "NVIDIA",
    color: "#C026D3",
    blurb: "NVIDIA's open model, available on a free tier. Tests whether a no-cost option is good enough.",
  },
];

const judge = results.judgeStats;

// The three models under test and the judge that grades them.
export function Lineup() {
  return (
    <section className="w-full text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Who was tested, and who graded</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        Three <span className="font-semibold text-indigo-700">candidate models</span> each wrote the same 150 summaries. A
        fourth model, the <span className="font-semibold text-amber-700">judge</span>, graded every sentence.
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CONTESTANTS.map((c) => (
          <div key={c.model} className="p-4 rounded-2xl bg-white border-2 border-indigo-100 border-t-4 shadow-xs" style={{ borderTopColor: c.color }}>
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Bot className="w-5 h-5" aria-hidden="true" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">Candidate</span>
            </div>
            <p className="font-bold text-slate-900 mt-3">{c.name}</p>
            <p className="text-xs text-slate-400">{c.company}</p>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-snug">{c.blurb}</p>
          </div>
        ))}
      </div>

      {/* Arrow from candidates to judge */}
      <div className="flex justify-center py-2 text-amber-500" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M12 4v14m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shrink-0 shadow-sm">
            <span role="img" aria-label="Judge">⚖️</span>
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">The judge</p>
            <p className="text-lg font-bold text-slate-900">Claude Sonnet 5.5 · Anthropic</p>
            <p className="text-sm text-slate-700 mt-1">
              Checked {judge.claimsChecked.toLocaleString("en-US")} claims in {judge.calls} summaries against the reports
              they cited. It graded; it never competed.
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-amber-800">Why this judge</p>
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {[
            {
              icon: Building2,
              title: "Independent",
              text: "From a fourth company. The other three couldn't judge: they were the candidates, and no model should grade itself.",
            },
            {
              icon: EyeOff,
              title: "Blind",
              text: "Its instructions contain only the reports and the summary, never which model wrote it.",
            },
            {
              icon: Gavel,
              title: "Capable",
              text: "A top-tier model known for careful reading and following detailed instructions. Grading means catching subtle gaps.",
            },
            {
              icon: ListChecks,
              title: "Reliable",
              text: `Returned a usable verdict for ${judge.calls} of ${judge.calls} summaries. A free judge tried earlier often returned nothing.`,
            },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.title} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/70 border border-amber-200 text-slate-700">
                <Icon className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-slate-900">{r.title}: </span>
                  {r.text}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-slate-600">
          Not chosen by a formal judge benchmark. The next step is a judge audit: a person reviews a sample of its verdicts
          and measures how often they agree.
        </p>
      </div>
    </section>
  );
}

// How the ranking was kept fair.
export function FairnessNote() {
  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">How the ranking was kept fair</h2>
      <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
        {[
          {
            icon: Ruler,
            text: "The ranking rule was set before the run: fewest unsupported claims wins, because in drug safety an invented fact is the costliest mistake.",
          },
          {
            icon: ListChecks,
            text: "Same instructions, same 600 real reports, same 20 golden reports for every candidate.",
          },
          {
            icon: EyeOff,
            text: "The judge was blind to model names and came from a different company than all three candidates.",
          },
          {
            icon: Bot,
            text: "Every measure is shown, including where the winner loses: Gemini is the slowest and most expensive, and Nemotron edges it on fact extraction (80% vs 79%).",
          },
        ].map((r) => {
          const Icon = r.icon;
          return (
            <li key={r.text} className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="pt-1">{r.text}</span>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-slate-500 mt-4">
        No model or company sponsored this project. With a different priority, say lowest cost, a different model would win.
      </p>
    </section>
  );
}

const NAMES: Record<string, string> = {
  "google/gemini-3.8-flash": "Gemini 3.8 Flash",
  "meta-llama/llama-3.3-70b-instruct": "Llama 3.3 70B",
  "nvidia/nemotron-3-super-120b-a12b:free": "Nemotron 3 Super",
};

// What running the eval cost, by role. Includes the judge.
export function EvalCostChart() {
  const rows = [
    ...results.models.map((m) => ({
      name: NAMES[m.model] ?? m.model,
      role: "Candidate",
      cost: m.totalCostUsd,
      judge: false,
      color: CONTESTANTS.find((c) => c.model === m.model)?.color ?? "#64748B",
    })),
    { name: "Claude Sonnet 5.5", role: "Judge", cost: judge.totalCostUsd, judge: true, color: "#F59E0B" },
  ].sort((a, b) => b.cost - a.cost);
  const max = Math.max(...rows.map((r) => r.cost));
  const judgeShare = Math.round((judge.totalCostUsd / results.totalRunCostUsd) * 100);

  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">What the eval cost, by model</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        Total ${results.totalRunCostUsd.toFixed(2)}. Grading took {judgeShare}% of it: checking a summary costs far more
        than writing one.
      </p>
      <ul className="mt-5 space-y-3">
        {rows.map((r) => (
          <li
            key={r.name}
            title={`${r.name} (${r.role}): $${r.cost.toFixed(2)}`}
            className="grid grid-cols-[8.5rem_1fr_4rem] sm:grid-cols-[11rem_1fr_4.5rem] items-center gap-3"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-800 truncate">
                {r.judge && <span aria-hidden="true">⚖️ </span>}
                {r.name}
              </span>
              <span className={`block text-[11px] ${r.judge ? "text-amber-700 font-semibold" : "text-slate-400"}`}>{r.role}</span>
            </span>
            <span className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <span
                className="block h-full rounded-full"
                style={{ width: `${Math.max((r.cost / max) * 100, r.cost > 0 ? 1.5 : 0)}%`, backgroundColor: r.color }}
              />
            </span>
            <span className="text-sm tabular-nums text-right text-slate-700">${r.cost.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-500 mt-4">
        Product takeaway: in production, grade a sample of summaries with the expensive judge rather than all of them, and let
        the human reviewer catch the rest.
      </p>
    </section>
  );
}

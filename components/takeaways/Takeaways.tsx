import { Target, Users, Gauge, GitBranch, Lightbulb, Calculator, Rocket, ChevronDown } from "lucide-react";
import results from "@/data/eval-results.json";
import known from "@/data/known-signals.json";
import answerKey from "@/data/answer-key.json";
import flagged from "@/data/flagged-signals.json";

const byModel = (id: string) => results.models.find((m) => m.model.includes(id))!;
const gemini = byModel("gemini");
const llama = byModel("llama");
const nemotron = byModel("nemotron");
const judge = results.judgeStats;

const judgePerCheck = judge.totalCostUsd / judge.calls;
const summaryCost = gemini.avgCostPerSummaryUsd ?? 0;
const generationCost = results.models.reduce((n, m) => n + m.totalCostUsd, 0);
const wrongOutcomes = (m: typeof gemini) => (m.summaries.categories as Record<string, number>)["wrong outcome"] ?? 0;
const caught = known.checks.filter((c) => c.flagged).length;
const money = (v: number, digits = 2) => `$${v.toFixed(digits)}`;

function Section({ icon: Icon, title, children }: { icon: typeof Target; title: string; children: React.ReactNode }) {
  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Icon className="w-4 h-4" aria-hidden="true" />
        </span>
        {title}
      </h2>
      <div className="mt-3 text-sm text-slate-700 leading-relaxed">{children}</div>
    </section>
  );
}

const DECISIONS = [
  {
    decision: "Statistics decide what gets flagged. AI never does.",
    why: "Flags must be explainable and repeatable. The same data always gives the same 150 signals, and anyone can check the math.",
    tradeoff: `Statistics only see what stands out. WiseFlag caught ${caught} of ${known.checks.length} known safety signals; risks shared by two vaccines stayed hidden.`,
  },
  {
    decision: "A human approves every AI summary.",
    why: `Even the best model passed only ${Math.round((gemini.summaries.passed / gemini.summaries.judged) * 100)}% of summaries under a strict judge. In drug safety, an unchecked invented fact is unacceptable.`,
    tradeoff: "Review is slower than full automation. The AI's job is to make each review faster, not to remove it.",
  },
  {
    decision: "Grade with a blind judge from a different company.",
    why: "A model grading its own family can be lenient. My first free run used an NVIDIA judge on an NVIDIA candidate, so I switched to Claude, which never saw model names.",
    tradeoff: `The judge became the biggest cost: ${money(judge.totalCostUsd)} of ${money(results.totalRunCostUsd)}.`,
  },
  {
    decision: `Evaluate all ${results.signalsEvaluated} signals, not a sample of 12.`,
    why: "A small hand-picked sample invites cherry-picking. Covering every signal makes the ranking defensible.",
    tradeoff: `Free API tiers couldn't handle the volume, so the run cost about ${money(results.totalRunCostUsd, 0)}. A cost cap stopped it safely at the budget.`,
  },
  {
    decision: "Pick Gemini 3.8 Flash despite higher cost.",
    why: `About ${((llama.summaries.unsupportedRatePct ?? 0) / (gemini.summaries.unsupportedRatePct ?? 1)).toFixed(1)}× fewer made-up claims and ${wrongOutcomes(gemini)} wrong outcomes vs ${wrongOutcomes(llama)} for Llama.`,
    tradeoff: `About ${Math.round(summaryCost / (llama.avgCostPerSummaryUsd ?? 1))}× the cost per summary of Llama and the slowest of the three. Still about a cent per summary.`,
  },
  {
    decision: "Build the answer key with rules, then verify every field by hand.",
    why: `Rules made labeling fast; a person made it trustworthy. ${answerKey.fieldsCorrected} draft values were wrong, such as "fainting" for a report of near-fainting.`,
    tradeoff: "Manual verification takes time, which is why the golden set is 20 reports rather than hundreds.",
  },
  {
    decision: "Never show made-up AI output as real.",
    why: "Every AI example on the site is either real eval output or clearly labeled as illustrative. Credibility is the product.",
    tradeoff: "Some pages waited for real data instead of using convincing placeholders.",
  },
];

const LESSONS = [
  {
    stat: `${(judge.totalCostUsd / generationCost).toFixed(1)}×`,
    text: `Checking AI output cost ${(judge.totalCostUsd / generationCost).toFixed(1)}× more than generating it (${money(judge.totalCostUsd)} vs ${money(generationCost)}). Evaluation is a real budget line, not an afterthought.`,
  },
  {
    stat: `${Math.round((1 - gemini.summaries.passed / gemini.summaries.judged) * 100)}%`,
    text: "Of the best model's summaries had at least one unsupported sentence. Human review isn't a formality; it's the safety net.",
  },
  {
    stat: `${wrongOutcomes(gemini)} vs ${wrongOutcomes(llama)}`,
    text: `The biggest gap between models was outcomes: ${wrongOutcomes(gemini)} wrong outcomes for Gemini vs ${wrongOutcomes(llama)} for Llama and ${wrongOutcomes(nemotron)} for Nemotron. For example, a hospital visit described as an admission.`,
  },
  {
    stat: `${Math.min(...results.models.map((m) => m.extraction.accuracyPct ?? 0))}–${Math.max(...results.models.map((m) => m.extraction.accuracyPct ?? 0))}%`,
    text: "Fact extraction was nearly identical across models. The real difference was in writing faithful summaries, so that's where to evaluate.",
  },
  {
    stat: `${caught}/${known.checks.length}`,
    text: "Known safety signals caught by statistics alone. Comparing vaccines against each other hides risks they share, a limit worth stating upfront.",
  },
  {
    stat: "Free ≠ ready",
    text: "Free tiers hit daily limits and a free judge returned empty answers. Reliable evals need a small, capped budget.",
  },
];

const NEXT = [
  "A real review queue with role-based access (Viewer, Reviewer, Safety lead, Admin) and an audit log",
  "Prompt v2 aimed at outcome errors, then re-run the same eval to measure the change",
  "Judge a 10% sample instead of every summary, with humans spot-checking the judge",
  "Measure reviewer time saved in a small user test: the metric that justifies the product",
  "Product analytics on the reviewer flow to see where people drop off",
];

export default function Takeaways() {
  const fullJudge = summaryCost + judgePerCheck;
  const sampled = summaryCost + 0.1 * judgePerCheck;

  return (
    <div className="space-y-6">
      <Section icon={Users} title="The problem and the user">
        <p>
          Drug safety teams receive far more adverse event reports than people can read: this dataset alone has{" "}
          {flagged.totalReports.toLocaleString("en-US")} reports from eleven months. Reports are unverified and messy, and
          the real risk is a genuine safety signal buried in noise.
        </p>
        <p className="mt-2">
          <span className="font-semibold">User:</span> a drug safety officer who must decide, signal by signal, what deserves
          a closer look. <span className="font-semibold">Job to be done:</span> find what&apos;s unusual, understand it
          quickly, and make a defensible call.
        </p>
      </Section>

      <Section icon={Gauge} title="How I measured success">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ["Made-up claim rate", "share of summary sentences not backed by a report"],
            ["Clean summary rate", "summaries with zero unsupported claims"],
            ["Causation claims", "must be zero: VAERS can't show cause"],
            ["Outcome accuracy", "no ER visit turned into an admission"],
            ["Extraction accuracy", "against a hand-verified answer key"],
            ["Cost per reviewed signal", "summary plus evaluation"],
          ].map(([k, v]) => (
            <li key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-semibold text-slate-900 text-sm">{k}</p>
              <p className="text-xs text-slate-500">{v}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          The ranking rule was fixed before the run: fewest made-up claims wins, because an invented fact is the costliest
          error in drug safety.
        </p>
      </Section>

      <Section icon={GitBranch} title="Key decisions and trade-offs">
        <ul className="space-y-2">
          {DECISIONS.map((d) => (
            <li key={d.decision}>
              <details className="group rounded-xl border border-slate-200 open:border-indigo-200 open:bg-indigo-50/40">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none p-3 font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xl">
                  {d.decision}
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="px-3 pb-3 space-y-1.5 text-sm">
                  <p>
                    <span className="font-semibold text-emerald-700">Why: </span>
                    {d.why}
                  </p>
                  <p>
                    <span className="font-semibold text-amber-700">Trade-off: </span>
                    {d.tradeoff}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Lightbulb} title="What the data taught me">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LESSONS.map((l) => (
            <li key={l.text} className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50/40">
              <p className="text-2xl font-extrabold text-indigo-700 tabular-nums">{l.stat}</p>
              <p className="text-sm text-slate-700 mt-1">{l.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Calculator} title="Unit economics">
        <p>Cost to produce and check one AI summary with the chosen model:</p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Judge every summary</p>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">{money(fullJudge, 3)}</p>
            <p className="text-xs text-slate-500">per signal · {money(fullJudge * results.signalsEvaluated)} for all {results.signalsEvaluated}</p>
          </div>
          <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Judge a 10% sample</p>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">{money(sampled, 3)}</p>
            <p className="text-xs text-slate-500">per signal · {money(sampled * results.signalsEvaluated)} for all {results.signalsEvaluated}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Either way, the AI costs cents per signal. The real cost is the reviewer&apos;s time, so time saved per review is the
          metric that would justify the product.
        </p>
      </Section>

      <Section icon={Rocket} title="What I'd build next">
        <ol className="space-y-2 list-none">
          {NEXT.map((n, i) => (
            <li key={n} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="pt-0.5">{n}</span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

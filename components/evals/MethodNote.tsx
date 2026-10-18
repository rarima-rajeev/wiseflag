import results from "@/data/eval-results.json";

const runDate = new Date(results.runAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const SETUP = [
  {
    term: "Contestants",
    text: "Gemini 3.8 Flash (Google), Llama 3.3 70B (Meta) and Nemotron 3 Super (NVIDIA), called through OpenRouter with the same versioned prompts.",
  },
  {
    term: "Judge",
    text: "Claude Sonnet 5.5 (Anthropic), a fourth company, so no model grades its own family. It checks every sentence against the reports the summary cites.",
  },
  {
    term: "Summary test",
    text: `All ${results.signalsEvaluated} flagged signals, each with 4 real VAERS reports from the Kaggle dataset.`,
  },
  {
    term: "Extraction test",
    text: `The ${results.goldenTotal} golden reports, scored field by field against the hand-verified answer key (${results.goldenVerified} of ${results.goldenTotal} verified).`,
  },
  {
    term: "Run",
    text: `${runDate}, one pass per model. Total cost about $${Math.round(results.totalRunCostUsd)}.`,
  },
];

const CAVEATS = [
  "The judge is an AI too, and strict: one unsupported sentence fails a whole summary. A sample of its verdicts was reviewed and looked reasonable, but it can still be wrong.",
  `About ${results.judgeQuirkFlags} flags (under 4%) were the judge objecting that a report never names the vaccine, even though the prompt does. This affects all three models similarly.`,
  "The judge sees only the reports, so it sometimes flags the PRR statistics a model repeated from its instructions as unsupported.",
  "4 reports per signal is a small sample, and each model ran once. Treat the numbers as a clear comparison, not a precise benchmark.",
];

export default function MethodNote() {
  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">How the eval was run</h2>
      <dl className="mt-3 space-y-2.5">
        {SETUP.map((s) => (
          <div key={s.term} className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-3">
            <dt className="text-xs font-semibold uppercase tracking-wider text-indigo-600 pt-0.5">{s.term}</dt>
            <dd className="text-sm text-slate-700">{s.text}</dd>
          </div>
        ))}
      </dl>

      <h3 className="text-sm font-bold text-slate-900 mt-5">Caveats</h3>
      <ul className="mt-2 space-y-1.5">
        {CAVEATS.map((c) => (
          <li key={c} className="flex gap-2 text-sm text-slate-600">
            <span className="text-amber-500 font-bold" aria-hidden="true">!</span>
            {c}
          </li>
        ))}
      </ul>
    </section>
  );
}

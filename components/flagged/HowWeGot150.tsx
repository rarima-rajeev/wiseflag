import flagged from "@/data/flagged-signals.json";

const CRITERIA = [
  {
    term: "PRR ≥ 2",
    name: "Proportional Reporting Ratio",
    plain: "The symptom is reported at least twice as often for this vaccine as for the other two.",
  },
  {
    term: "χ² ≥ 4",
    name: "Yates-corrected chi-square (p < 0.05)",
    plain: "The difference is statistically significant, not likely due to chance.",
  },
  {
    term: "n ≥ 30",
    name: "Minimum case count",
    plain: "At least 30 reports, so the signal isn't driven by a handful of cases.",
  },
];

export default function HowWeGot150() {
  const max = Math.max(...flagged.byVaccine.map((v) => v.count));

  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Disproportionality analysis</p>
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
        How we got to {flagged.flaggedTotal}
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 mt-1">
        Every symptom–vaccine pair was tested against the Evans criteria, a standard pharmacovigilance screening rule. A
        pair is flagged as a signal only if it meets all three:
      </p>

      <ol className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CRITERIA.map((c) => (
          <li key={c.term} className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <p className="text-lg font-extrabold text-indigo-700">{c.term}</p>
            <p className="text-xs font-semibold text-slate-700">{c.name}</p>
            <p className="text-xs text-slate-600 mt-1 leading-snug">{c.plain}</p>
          </li>
        ))}
      </ol>

      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-snug">
        <span className="font-bold">Prioritization:</span> signals meeting all three criteria were ranked by statistical
        strength (chi-square), and the top {flagged.flaggedTotal} were selected for review. Lower-ranked signals also met
        the thresholds but showed weaker evidence of disproportionate reporting, so they were deprioritized for this
        review.
      </div>

      <div className="mt-5">
        <p className="text-sm font-bold text-slate-900">
          The {flagged.flaggedTotal} selected signals, by vaccine
        </p>
        <ul className="mt-3 space-y-2">
          {flagged.byVaccine.map((v) => (
            <li
              key={v.vaccine}
              title={`${v.vaccine}: ${v.count} of ${flagged.flaggedTotal} signals`}
              className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-3"
            >
              <span className="text-xs sm:text-sm font-medium text-slate-700">{v.vaccine}</span>
              <span className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <span className="block h-full bg-indigo-500 rounded-full" style={{ width: `${(v.count / max) * 100}%` }} />
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 tabular-nums text-right">{v.count}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-3">
          A higher count doesn&apos;t mean a less safe vaccine. Each vaccine is compared against the other two, and
          differences in who received which vaccine, and when, affect reporting.
        </p>
      </div>
    </section>
  );
}

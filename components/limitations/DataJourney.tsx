import flagged from "@/data/flagged-signals.json";

const STEPS = [
  { value: flagged.totalRows.toLocaleString("en-US"), label: "Rows in the raw VAERS file from Kaggle (1 GB, Jan–Nov 2021)" },
  { value: flagged.totalReports.toLocaleString("en-US"), label: "Unique reports after merging duplicate rows per report ID" },
  { value: "3", label: "Vaccines kept: Pfizer-BioNTech, Moderna, Janssen" },
  { value: "PRR ≥ 2", label: "Flag rule: reported at least 2× as often, χ² ≥ 4, and at least 30 reports" },
  { value: flagged.flaggedTotal.toString(), label: "Strongest flags kept for review" },
];

export default function DataJourney() {
  return (
    <section className="w-full text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">How the data was processed</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
        All of this runs as plain code on a laptop. No AI is involved in finding the flags.
      </p>
      <ol className="relative border-l-2 border-indigo-100 ml-3 space-y-4">
        {STEPS.map((s, i) => (
          <li key={s.label} className="pl-6 relative">
            <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <p className="text-lg font-extrabold text-slate-900 tabular-nums">{s.value}</p>
            <p className="text-sm text-slate-600">{s.label}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

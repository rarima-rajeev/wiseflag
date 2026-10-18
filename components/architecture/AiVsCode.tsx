import flagged from "@/data/flagged-signals.json";

const ROWS: { step: string; by: string; ai: boolean; note?: string }[] = [
  {
    step: `Clean ${flagged.totalRows.toLocaleString("en-US")} rows into ${flagged.totalReports.toLocaleString("en-US")} unique reports`,
    by: "Python + DuckDB script",
    ai: false,
  },
  { step: `Flag ${flagged.flaggedTotal} signals (PRR, ROR, χ², 30+ reports)`, by: "Statistics code", ai: false },
  { step: "Pick the 20 golden reports", by: "10 random by script, 10 tricky by hand", ai: false },
  { step: "Pre-fill the 5 fields for the answer key", by: "Python text-matching rules", ai: false },
  { step: "Confirm the answer key", by: "Me (human)", ai: false },
  { step: "Pull the 5 fields from the 20 reports (the exam)", by: "Gemini, Llama, Nemotron", ai: true },
  { step: "Summarize the reports behind each signal", by: "Gemini, Llama, Nemotron", ai: true },
  { step: "Grade summaries for unsupported claims", by: "Claude Sonnet 5.5 (judge)", ai: true },
  { step: "Score extraction against the answer key", by: "Script", ai: false },
  { step: "Choose the winning model", by: "Ranking rule I set before the run", ai: false },
  { step: "Approve, edit or reject; judge causality", by: "Human safety officer", ai: false },
  { step: "Write the code for the app and this site", by: "Me, with AI coding tools (Antigravity, Claude)", ai: true, note: "build time only" },
];

export default function AiVsCode() {
  const aiCount = ROWS.filter((r) => r.ai && !r.note).length;
  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">What AI does, and what it doesn&apos;t</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        Every step, at a glance. AI does {aiCount} of them, all about reading text. Everything that decides something is
        statistics or a person.
      </p>
      <div className="mt-4 overflow-x-auto -mx-1">
        <table className="w-full min-w-[30rem] text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
              <th className="py-2 px-1 font-semibold">Step</th>
              <th className="py-2 px-1 font-semibold">Done by</th>
              <th className="py-2 px-1 font-semibold text-center">AI?</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.step} className={`border-b border-slate-100 last:border-0 ${r.ai && !r.note ? "bg-indigo-50/50" : ""}`}>
                <td className="py-2 px-1 text-slate-800">{r.step}</td>
                <td className="py-2 px-1 text-slate-600">
                  {r.by}
                  {r.note && <span className="text-xs text-slate-400"> ({r.note})</span>}
                </td>
                <td className="py-2 px-1 text-center" aria-label={r.ai ? "Yes" : "No"}>
                  {r.ai ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <blockquote className="mt-4 p-4 rounded-xl bg-indigo-600 text-white text-sm sm:text-base font-semibold leading-snug">
        “I used AI only where it adds speed, reading messy text, and kept every decision with statistics or a human.”
      </blockquote>
    </section>
  );
}

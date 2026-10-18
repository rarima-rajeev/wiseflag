"use client";

import { useState } from "react";

type Source = "eval" | "prefill" | "possible";

interface Scenario {
  title: string;
  report: string;
  misread: string;
  source: Source;
  who?: string;
}

// "eval" and "prefill" examples are real, taken from this project's outputs; "possible" ones are realistic illustrations.
const SCENARIOS: Scenario[] = [
  {
    title: "Hospital visit becomes an admission",
    report: "“went to the hospital on 4/11” and was diagnosed with clots",
    misread: "“All four reports described hospital admission”",
    source: "eval",
    who: "Nemotron 3 Super · Pulmonary thrombosis",
  },
  {
    title: "Matching part of a word",
    report: "“presyncope” (near-fainting)",
    misread: "Syncope (fainting)",
    source: "prefill",
    who: "Python pre-fill · report #1011093",
  },
  {
    title: "Near-fainting becomes fainting",
    report: "“feeling of passing out”",
    misread: "“fainted”",
    source: "possible",
  },
  {
    title: "The wrong person's age",
    report: "“my 70-year-old mother drove him to the clinic”",
    misread: "Patient age: 70",
    source: "possible",
  },
  {
    title: "The wrong person's sex",
    report: "“a female nurse gave the shot to my son”",
    misread: "Patient sex: Female",
    source: "possible",
  },
  {
    title: "Adding a treatment detail",
    report: "“Gave fluids for dehydration”",
    misread: "“receiving IV fluids”",
    source: "eval",
    who: "Gemini 3.8 Flash · Vaccination complication",
  },
  {
    title: "Inventing the timing",
    report: "Symptoms began “1/6/21 at 8pm”; vaccination date not given",
    misread: "“symptoms starting the evening of vaccination”",
    source: "eval",
    who: "Llama 3.3 70B · Myocarditis",
  },
  {
    title: "Crediting a treatment",
    report: "Took Benadryl “right away”; hives “went away after several hours”",
    misread: "“Benadryl seemed to help alleviate the symptoms”",
    source: "eval",
    who: "Llama 3.3 70B · Injection site urticaria",
  },
  {
    title: "Flipping a detail",
    report: "Lying on the side “provided minimal relief”",
    misread: "Pain “exacerbated by … lying on the side”",
    source: "eval",
    who: "Nemotron 3 Super · Myocarditis",
  },
  {
    title: "Claiming the vaccine caused it",
    report: "Events reported after vaccination; one reporter asks if it was a coincidence",
    misread: "“a range of reactions to the vaccine”",
    source: "eval",
    who: "Llama 3.3 70B · Disease recurrence",
  },
];

const SOURCE_STYLE: Record<Source, { label: string; className: string }> = {
  eval: { label: "Real · AI eval", className: "bg-rose-50 text-rose-700 border-rose-200" },
  prefill: { label: "Real · Python rules", className: "bg-amber-50 text-amber-800 border-amber-200" },
  possible: { label: "Possible", className: "bg-white text-slate-500 border-slate-300 border-dashed" },
};

export default function MisreadScenarios() {
  const [filter, setFilter] = useState<"all" | "real">("all");
  const shown = SCENARIOS.filter((s) => filter === "all" || s.source !== "possible");
  const realCount = SCENARIOS.filter((s) => s.source !== "possible").length;

  return (
    <section className="w-full text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">10 ways a report gets misread</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        Machines read words, not meaning. {realCount} of these really happened in this project; the rest are realistic risks.
        Each is a reason a person checks the summary against the report.
      </p>

      <div className="mt-3 flex gap-2" role="group" aria-label="Filter scenarios">
        {(
          [
            ["all", `All ${SCENARIOS.length}`],
            ["real", `Only real (${realCount})`],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            aria-pressed={filter === k}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
              filter === k ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <ol className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shown.map((s) => {
          const style = SOURCE_STYLE[s.source];
          return (
            <li key={s.title} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-sm text-slate-900">{SCENARIOS.indexOf(s) + 1}. {s.title}</p>
                <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${style.className}`}>
                  {style.label}
                </span>
              </div>
              <div className="mt-2 space-y-1.5 text-sm">
                <p className="text-slate-700">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">Report</span>
                  {s.report}
                </p>
                <p className="text-rose-900">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 mr-1">Read as</span>
                  {s.misread}
                </p>
              </div>
              {s.who && <p className="text-[11px] text-slate-400 mt-2">{s.who}</p>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

"use client";

import { useState } from "react";

// Illustrative example written for this page; not output from a recorded eval run.
const REPORT =
  "28-year-old woman. Sore arm and mild fever starting the evening after dose 2. Took ibuprofen. Feeling better after 2 days.";

const CLAIMS = [
  { text: "The patient is a 28-year-old woman.", supported: true },
  { text: "Symptoms started the evening after the second dose.", supported: true },
  { text: "She was taken to the emergency room.", supported: false },
  { text: "She recovered within about 2 days.", supported: true },
];

export default function SpotTheFakeFact() {
  const [picked, setPicked] = useState<number | null>(null);
  const found = picked !== null && !CLAIMS[picked].supported;

  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Can you spot the made-up fact?
        </h2>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
          Illustrative example
        </span>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        This is the kind of check every AI summary goes through. Read the report, then tap the sentence the AI invented.
      </p>

      <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Original report</p>
        <p className="text-sm text-slate-700">{REPORT}</p>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500 mt-5 mb-2">AI summary</p>
      <ul className="space-y-2">
        {CLAIMS.map((c, i) => {
          const isPicked = picked === i;
          let style = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40";
          if (found && !c.supported) style = "border-rose-300 bg-rose-50 text-rose-900";
          else if (isPicked && c.supported) style = "border-amber-300 bg-amber-50";
          else if (found) style = "border-emerald-200 bg-emerald-50/50 text-slate-600";
          return (
            <li key={c.text}>
              <button
                type="button"
                onClick={() => !found && setPicked(i)}
                aria-pressed={isPicked}
                className={`w-full flex items-start gap-3 text-left text-sm px-3 py-2.5 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${style}`}
              >
                <span className="shrink-0 w-5 text-center font-bold" aria-hidden="true">
                  {found ? (c.supported ? "✓" : "✗") : isPicked ? "?" : "•"}
                </span>
                <span>{c.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite">
        {picked !== null && (
          <p key={picked} className={`wf-fade-up text-sm mt-4 ${found ? "text-rose-800" : "text-amber-800"}`}>
            {found
              ? "Got it. The report never mentions an emergency room. An eval counts this as an invented fact, and a human reviewer would reject the summary."
              : "That one is backed by the report. Try another."}
          </p>
        )}
      </div>
    </section>
  );
}

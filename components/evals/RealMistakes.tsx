"use client";

import { useState } from "react";
import data from "@/data/eval-examples.json";
import { track } from "@/lib/analytics";

export default function RealMistakes() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const ex = data.examples[index];

  function pick(i: number) {
    setIndex(i);
    setRevealed(false);
  }

  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Real mistakes the judge caught</h2>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
          Real AI output
        </span>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        Quoted word for word from the eval run. Read what the AI wrote, spot the problem, then see what the judge found.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choose an example">
        {data.examples.map((e, i) => (
          <button
            key={i}
            type="button"
            onClick={() => pick(i)}
            aria-pressed={index === i}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
              index === i
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div key={index} className="wf-fade-up mt-4 space-y-3">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{ex.model}</span> summarizing{" "}
          <span className="font-semibold text-slate-700">{ex.signal}</span>
        </p>

        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500 mb-1">What the AI wrote</p>
          <p className="text-sm text-slate-800">&ldquo;{ex.claim}&rdquo;</p>
          {ex.cited_report && <p className="text-xs text-slate-500 mt-1.5">Cited: {ex.cited_report}</p>}
        </div>

        {!revealed ? (
          <button
            type="button"
            onClick={() => {
              setRevealed(true);
              track("real_mistake_revealed", { example: ex.label, model: ex.model });
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-sm font-semibold hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            Show what the judge found
          </button>
        ) : (
          <div className="wf-fade-up p-4 rounded-xl bg-rose-50 border border-rose-200" aria-live="polite">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 mb-1">
              <span aria-hidden="true">⚖️ </span>Judge: {data.judge} · {ex.category}
            </p>
            <p className="text-sm text-rose-950">{ex.reason}</p>
          </div>
        )}
      </div>
    </section>
  );
}

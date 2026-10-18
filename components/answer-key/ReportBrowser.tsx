"use client";

import { useState } from "react";
import answerKey from "@/data/answer-key.json";

type Filter = "all" | "random" | "hard";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: `All ${answerKey.total}` },
  { key: "random", label: `Random (${answerKey.random})` },
  { key: "hard", label: `Tricky (${answerKey.hard})` },
];

export default function ReportBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(answerKey.reports.find((r) => r.hard)?.id ?? answerKey.reports[0].id);
  const selected = answerKey.reports.find((r) => r.id === selectedId)!;

  const visible = (r: (typeof answerKey.reports)[number]) =>
    filter === "all" || (filter === "hard" ? r.hard : !r.hard);

  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Browse the 20 test reports</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        Half were picked at random. Half were picked on purpose because they&apos;re easy for an AI to get wrong. Tap one to read it.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter reports">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
              filter === f.key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-5 sm:grid-cols-10 gap-2">
        {answerKey.reports.map((r, i) => {
          const isSelected = r.id === selectedId;
          const shown = visible(r);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedId(r.id)}
              disabled={!shown}
              aria-pressed={isSelected}
              aria-label={`Report ${i + 1}, ${r.vaccine}, ${r.hard ? `tricky: ${r.category}` : "random pick"}`}
              title={r.hard ? r.category ?? "Tricky" : "Random pick"}
              className={`h-10 sm:h-11 rounded-xl border-2 text-xs font-bold flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-1 ${
                r.hard ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-cyan-50 border-cyan-200 text-cyan-800"
              } ${isSelected ? "ring-2 ring-indigo-600 ring-offset-2 scale-105" : "hover:-translate-y-0.5"} ${
                shown ? "" : "opacity-20 cursor-default"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-cyan-50 border-2 border-cyan-200" aria-hidden="true" /> Random pick
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-50 border-2 border-amber-200" aria-hidden="true" /> Tricky on purpose
        </span>
      </div>

      <div key={selected.id} className="wf-fade-up mt-5 rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          <p className="text-xs font-semibold text-slate-600">
            VAERS #{selected.id} · {selected.vaccine}
          </p>
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-0.5 ${
              selected.hard ? "bg-amber-100 text-amber-800" : "bg-cyan-100 text-cyan-800"
            }`}
          >
            {selected.hard ? selected.category : "Random pick"}
          </span>
        </div>
        <p className="px-4 py-3 text-sm text-slate-700 leading-relaxed max-h-56 overflow-y-auto">{selected.narrative}</p>
        <div className={`px-4 py-3 border-t ${selected.hard ? "bg-amber-50/60 border-amber-100" : "bg-cyan-50/50 border-cyan-100"}`}>
          <p className="text-xs font-semibold text-slate-700 mb-0.5">
            {selected.hard ? "Why it's tricky" : "Why it's here"}
          </p>
          <p className="text-sm text-slate-700">
            {selected.hard
              ? selected.trap
              : "Picked at random (balanced across the three vaccines) so the test also covers everyday, typical reports."}
          </p>
        </div>
      </div>
    </section>
  );
}

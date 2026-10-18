"use client";

import { useState } from "react";
import reviewCase from "@/data/review-case.json";

// The reports are real VAERS narratives. The summary is an illustrative AI-style draft written for this
// exercise (with one planted error and one omission), not a recorded model output.
const CLAIMS = [
  { text: "Symptoms began between 34 hours and about one week after vaccination.", cites: ["1214117", "1172339"], ok: true },
  { text: "Two diagnoses were supported by lumbar puncture.", cites: ["1133722", "1198191"], ok: true },
  { text: "One patient developed respiratory failure and needed mechanical ventilation.", cites: ["1198191"], ok: true },
  { text: "All patients fully recovered after IVIG treatment.", cites: ["1133722", "1198191"], ok: false },
];

type Decision = "approve" | "edit" | "reject";

const REASONS = [
  { key: "invented", label: "Invented fact", correct: true },
  { key: "context", label: "Missing key context", correct: true },
  { key: "causation", label: "Claims the vaccine caused it", correct: false },
  { key: "citation", label: "Cites the wrong report", correct: false },
];

const FEEDBACK: Record<Decision, { tone: string; title: string; body: string }> = {
  approve: {
    tone: "bg-rose-50 border-rose-200 text-rose-900",
    title: "This one should not be approved.",
    body: "The last sentence says everyone fully recovered, but none of the reports say that. Two patients were still being treated. An approved summary with an invented outcome could make a serious signal look harmless.",
  },
  edit: {
    tone: "bg-amber-50 border-amber-200 text-amber-900",
    title: "Reasonable, if you fix two things.",
    body: "Delete the recovery sentence (no report supports it) and add that report #1214117 had GBS once before, after a yellow fever vaccine. Every edit is logged, so the team can see what the AI got wrong.",
  },
  reject: {
    tone: "bg-emerald-50 border-emerald-200 text-emerald-900",
    title: "Good call.",
    body: "The recovery sentence is invented, and the summary leaves out that report #1214117 had GBS before, after a yellow fever vaccine, which matters when judging this case. The rejection reason is logged and used to improve the prompt.",
  },
};

export default function YouBeTheReviewer() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const needsReasons = decision === "reject";
  const canSubmit = decision !== null && (!needsReasons || reasons.length > 0);
  const s = reviewCase.signal;

  function toggleReason(key: string) {
    setReasons((r) => (r.includes(key) ? r.filter((k) => k !== key) : [...r, key]));
  }

  function reset() {
    setDecision(null);
    setReasons([]);
    setSubmitted(false);
    setActiveReport(null);
  }

  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">You be the reviewer</h2>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
          Real reports · example summary
        </span>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        You&apos;re the drug safety officer. Read the evidence, check the AI&apos;s summary, and make the call.
      </p>

      {/* Signal header */}
      <div className="mt-4 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Flagged signal · {s.vaccine}</p>
        <p className="text-lg font-bold text-slate-900">{s.symptom}</p>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {s.reports} reports · reported {s.prr.toFixed(1)}× as often as for the other vaccines · rank #{s.rank}
        </p>
      </div>

      {/* Evidence */}
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-5 mb-2">
        Evidence: {reviewCase.reports.length} real VAERS reports
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {reviewCase.reports.map((r) => {
          const active = activeReport === r.id;
          return (
            <div
              key={r.id}
              className={`p-3 rounded-xl border text-xs leading-relaxed transition-colors ${
                active ? "bg-amber-50 border-amber-300" : "bg-slate-50 border-slate-200"
              }`}
            >
              <p className="font-semibold text-slate-700 mb-1">
                #{r.id} · {r.sex}, {r.age}
              </p>
              <p className="text-slate-600">{r.text}</p>
            </div>
          );
        })}
      </div>

      {/* AI summary */}
      <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500 mt-5 mb-2">AI summary (draft)</p>
      <ul className="space-y-2">
        {CLAIMS.map((c) => {
          const flagged = submitted && !c.ok;
          return (
            <li
              key={c.text}
              className={`px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                flagged ? "bg-rose-50 border-rose-300 text-rose-900" : "border-slate-200 text-slate-700"
              }`}
            >
              {flagged && <span className="font-bold mr-1">✗</span>}
              {c.text}{" "}
              {c.cites.map((id) => (
                <button
                  key={id}
                  type="button"
                  onMouseEnter={() => setActiveReport(id)}
                  onMouseLeave={() => setActiveReport(null)}
                  onFocus={() => setActiveReport(id)}
                  onBlur={() => setActiveReport(null)}
                  onClick={() => setActiveReport(activeReport === id ? null : id)}
                  className="inline-block mx-0.5 px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[11px] font-semibold hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                  aria-label={`Highlight report ${id}`}
                >
                  #{id}
                </button>
              ))}
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-slate-400 mt-2">Hover or tap a citation to highlight the report it points to.</p>

      {/* Decision */}
      {!submitted ? (
        <div className="mt-5">
          <p className="text-sm font-bold text-slate-900">Your decision</p>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2" role="group" aria-label="Your decision">
            {[
              { key: "approve" as const, label: "Approve", style: "hover:border-emerald-400", on: "bg-emerald-600 border-emerald-600 text-white" },
              { key: "edit" as const, label: "Edit & approve", style: "hover:border-amber-400", on: "bg-amber-500 border-amber-500 text-white" },
              { key: "reject" as const, label: "Reject", style: "hover:border-rose-400", on: "bg-rose-600 border-rose-600 text-white" },
            ].map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setDecision(d.key)}
                aria-pressed={decision === d.key}
                className={`px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                  decision === d.key ? d.on : `bg-white border-slate-200 text-slate-700 ${d.style}`
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {needsReasons && (
            <div className="wf-fade-up mt-3">
              <p className="text-xs font-semibold text-slate-600">A rejection needs a reason. Pick all that apply:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {REASONS.map((r) => {
                  const on = reasons.includes(r.key);
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => toggleReason(r.key)}
                      aria-pressed={on}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                        on ? "bg-rose-600 border-rose-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-rose-300"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!canSubmit}
            className="mt-4 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            Submit decision
          </button>
        </div>
      ) : (
        decision && (
          <div className="wf-fade-up mt-5 space-y-3" aria-live="polite">
            <div className={`p-4 rounded-xl border ${FEEDBACK[decision].tone}`}>
              <p className="font-bold text-sm">{FEEDBACK[decision].title}</p>
              <p className="text-sm mt-1">{FEEDBACK[decision].body}</p>
              {decision === "reject" && (
                <p className="text-xs mt-2">
                  Your reasons:{" "}
                  {REASONS.filter((r) => reasons.includes(r.key))
                    .map((r) => `${r.label} ${r.correct ? "✓" : "(not this time)"}`)
                    .join(" · ")}
                  {REASONS.filter((r) => r.correct && !reasons.includes(r.key)).length > 0 &&
                    ` · Also applies: ${REASONS.filter((r) => r.correct && !reasons.includes(r.key))
                      .map((r) => r.label)
                      .join(", ")}`}
                </p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
              <p className="font-bold text-slate-900">What happened in real life</p>
              <p className="mt-1">{s.note}</p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
            >
              Try again
            </button>
          </div>
        )
      )}
    </section>
  );
}

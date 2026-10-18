import { FileText, Layers3, UserCheck } from "lucide-react";
import results from "@/data/eval-results.json";

const models = results.models.length;
const golden = results.goldenTotal;
const signals = results.signalsEvaluated;
const reportsPerSignal = 4;
const summaries = results.models.reduce((n, m) => n + m.summaries.judged, 0);
const extractions = models * golden;
const judgeChecks = results.judgeStats.calls;

const TESTS = [
  {
    icon: FileText,
    title: "Test 1 · Fact extraction",
    math: `${models} models × ${golden} golden reports = ${extractions} calls`,
    input: `The text of the ${golden} golden reports. I verified every field of these by hand first, so the correct answers are known.`,
    task: "Pull out age, sex, symptoms, onset timing and outcome. Write \"not reported\" if the report doesn't say.",
    graded: "Automatically, by a script comparing each field with the hand-verified answer key. No judge needed.",
  },
  {
    icon: Layers3,
    title: "Test 2 · Signal summaries",
    math: `${models} models × ${signals} signals = ${summaries} summaries`,
    input: `All ${signals} signals flagged by statistics, each with its numbers (PRR, ROR, χ², case count) and ${reportsPerSignal} real reports: ${signals * reportsPerSignal} reports in total.`,
    task: "Write a short summary for a safety officer, citing a report for every statement and never claiming the vaccine caused anything.",
    graded: `By the judge, sentence by sentence, against the reports each summary cites: ${judgeChecks} checks.`,
  },
];

export default function WhatWentIn() {
  return (
    <section className="w-full text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">What went into the test</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        Every model got exactly the same inputs and instructions. There were two tests, graded two different ways.
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TESTS.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.title} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <p className="font-bold text-slate-900">{t.title}</p>
              </div>
              <p className="mt-3 inline-block px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-sm font-semibold tabular-nums">{t.math}</p>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  ["Input", t.input],
                  ["Task", t.task],
                  ["Graded", t.graded],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{k}</dt>
                    <dd className="text-slate-700">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
        {[
          { v: extractions, l: "extraction calls (scored by script)" },
          { v: summaries, l: "summaries written" },
          { v: judgeChecks, l: "judge checks, one per summary" },
        ].map((s) => (
          <div key={s.l} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xl font-extrabold text-slate-900 tabular-nums">{s.v}</p>
            <p className="text-xs text-slate-500">{s.l}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {extractions + summaries + judgeChecks} AI calls in total ({extractions} + {summaries} + {judgeChecks}).
      </p>

      <div className="mt-3 flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-sm text-slate-700">
        <UserCheck className="w-5 h-5 shrink-0 text-emerald-700 mt-0.5" aria-hidden="true" />
        <p>
          <span className="font-semibold">Where people fit in:</span> the {signals} signals go to the AI straight from the
          statistics, with no human review needed at that stage. A person reviews the AI&apos;s summaries afterwards, before
          anything is acted on.
        </p>
      </div>
    </section>
  );
}

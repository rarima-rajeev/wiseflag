"use client";

import { useState } from "react";
import known from "@/data/known-signals.json";
import flagged from "@/data/flagged-signals.json";

type Check = (typeof known.checks)[number];

const OTHER_MRNA: Record<string, string> = { Moderna: "Pfizer-BioNTech", "Pfizer-BioNTech": "Moderna" };

function explain(c: Check): string {
  if (c.flagged) {
    const term = c.matchedTerm && c.matchedTerm !== c.symptom ? ` (matched as "${c.matchedTerm}")` : "";
    return `Caught${term}: ranked #${c.rank} of ${flagged.flaggedTotal} flags, reported ${c.prr?.toFixed(1)}× as often as for the other vaccines across ${c.reports?.toLocaleString("en-US")} reports.`;
  }
  const other = OTHER_MRNA[c.vaccine];
  return other
    ? `Missed. Likely reason: ${other} has the same issue. WiseFlag compares vaccines against each other, so a risk two vaccines share doesn't stand out.`
    : "Missed. It didn't stand out against the other vaccines.";
}

function Row({ c, guess, setGuess }: { c: Check; guess: boolean | null; setGuess: (g: boolean) => void }) {
  const revealed = guess !== null;
  const right = guess === c.flagged;

  return (
    <li className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{c.vaccine}</p>
          <p className="font-bold text-slate-900">{c.symptom}</p>
        </div>
        {!revealed ? (
          <div className="flex gap-2 shrink-0" role="group" aria-label={`Did WiseFlag catch ${c.symptom} for ${c.vaccine}?`}>
            <button
              type="button"
              onClick={() => setGuess(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Caught it
            </button>
            <button
              type="button"
              onClick={() => setGuess(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:border-rose-400 hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Missed it
            </button>
          </div>
        ) : (
          <span
            className={`wf-pop inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold ${
              c.flagged ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            }`}
          >
            {c.flagged ? "✓ Caught" : "✗ Missed"}
          </span>
        )}
      </div>
      {revealed && (
        <div className="wf-fade-up mt-3 text-sm text-slate-700 space-y-1.5">
          <p className="text-xs font-semibold text-slate-500">{right ? "You guessed right." : "Not quite."}</p>
          <p>{explain(c)}</p>
          <p className="text-xs text-slate-500">Known from: {c.note}</p>
        </div>
      )}
    </li>
  );
}

export default function RealityCheck() {
  const [guesses, setGuesses] = useState<Record<string, boolean>>({});
  const caught = known.checks.filter((c) => c.flagged).length;
  const keyOf = (c: Check) => `${c.vaccine}-${c.symptom}`;
  const answered = Object.keys(guesses).length;
  const correct = known.checks.filter((c) => guesses[keyOf(c)] === c.flagged).length;
  return (
    <section className="w-full text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Reality check: did it catch the known ones?</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        In 2021, the CDC and FDA confirmed several real safety signals. Guess whether WiseFlag flagged each one, then see the answer.
      </p>
      <ul className="mt-4 space-y-3">
        {known.checks.map((c) => (
          <Row
            key={keyOf(c)}
            c={c}
            guess={guesses[keyOf(c)] ?? null}
            setGuess={(g) => setGuesses((prev) => ({ ...prev, [keyOf(c)]: g }))}
          />
        ))}
      </ul>
      {answered === known.checks.length ? (
        <p className="wf-fade-up text-sm text-slate-700 mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <span className="font-bold">
            You got {correct} of {known.checks.length}. WiseFlag caught {caught} of {known.checks.length}.
          </span>{" "}
          The misses are the most useful lesson here: statistics can only find what stands out. That&apos;s why a
          person, not the tool, has the final say.
        </p>
      ) : (
        <p className="text-xs text-slate-500 mt-3">
          {answered} of {known.checks.length} answered. Finish all {known.checks.length} to see the final score.
        </p>
      )}
    </section>
  );
}

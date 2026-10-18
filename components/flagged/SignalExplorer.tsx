"use client";

import { useMemo, useState } from "react";
import flagged from "@/data/flagged-signals.json";
import { track } from "@/lib/analytics";

type Signal = (typeof flagged.signals)[number];
type SortKey = "reports" | "prr";

const VACCINES = ["All", ...flagged.byVaccine.map((v) => v.vaccine)];
const TOP_N = 10;

function pct(n: number, d: number): string {
  const p = (n / d) * 100;
  if (p >= 1) return `${p.toFixed(1)}%`;
  return `${Number(p.toPrecision(2))}%`;
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
        active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
      }`}
    >
      {children}
    </button>
  );
}

function SignalDetail({ s }: { s: Signal }) {
  const otherVaccines = flagged.byVaccine
    .map((v) => v.vaccine)
    .filter((v) => v !== s.vaccine)
    .join(" and ");
  const rateTarget = s.a / s.nTarget;
  const rateOther = s.c / s.nOther;
  const maxRate = Math.max(rateTarget, rateOther);

  return (
    <div key={s.id} className="wf-fade-up mt-5 p-4 sm:p-5 rounded-xl bg-indigo-50/60 border border-indigo-100">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
        {s.vaccine}
      </p>
      <h3 className="text-lg font-bold text-slate-900 mt-0.5">{s.symptom}</h3>
      <p className="text-sm text-slate-700 mt-2">
        Reported <span className="font-bold text-indigo-700">{s.prr.toFixed(1)}×</span> as
        often for {s.vaccine} as for {otherVaccines}, relative to how many reports each had.
      </p>

      <div className="mt-4 space-y-3">
        {[
          { label: s.vaccine, n: s.a, d: s.nTarget, rate: rateTarget, color: "bg-indigo-600" },
          { label: otherVaccines, n: s.c, d: s.nOther, rate: rateOther, color: "bg-slate-400" },
        ].map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span className="font-medium">{row.label}</span>
              <span className="tabular-nums">
                {row.n.toLocaleString("en-US")} of {row.d.toLocaleString("en-US")} reports ({pct(row.n, row.d)})
              </span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full ${row.color} rounded-full transition-[width] duration-500`}
                style={{ width: `${(row.rate / maxRate) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-4">
        A flag means &quot;look closer,&quot; not &quot;the vaccine caused this.&quot; A person reviews every one.
      </p>
    </div>
  );
}

export default function SignalExplorer() {
  const [vaccine, setVaccine] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("reports");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");

  const matching = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flagged.signals
      .filter((s) => vaccine === "All" || s.vaccine === vaccine)
      .filter((s) => !q || s.symptom.toLowerCase().includes(q))
      .sort((x, y) => y[sortKey] - x[sortKey]);
  }, [vaccine, sortKey, query]);

  const searching = query.trim() !== "";
  const expanded = showAll || searching;
  const rows = expanded ? matching : matching.slice(0, TOP_N);

  const max = Math.max(1, ...rows.map((r) => r[sortKey]));
  const selected = rows.find((r) => r.id === selectedId) ?? rows[0];

  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        Explore the flagged symptoms
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        Pick a vaccine and a ranking, search, or show all {flagged.flaggedTotal}. Tap any bar to see why it was flagged.
      </p>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by vaccine">
          {VACCINES.map((v) => (
            <Pill key={v} active={vaccine === v} onClick={() => { setVaccine(v); setSelectedId(null); }}>
              {v}
            </Pill>
          ))}
        </div>
        <div className="flex gap-2" role="group" aria-label="Rank by">
          <Pill active={sortKey === "reports"} onClick={() => { setSortKey("reports"); setSelectedId(null); }}>
            Most reports
          </Pill>
          <Pill active={sortKey === "prr"} onClick={() => { setSortKey("prr"); setSelectedId(null); }}>
            Most unusual
          </Pill>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="signal-search" className="sr-only">
          Search flagged symptoms
        </label>
        <input
          id="signal-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedId(null);
          }}
          placeholder={`Search all ${flagged.flaggedTotal} signals, e.g. Myocarditis`}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
        />
      </div>

      <p className="text-xs text-slate-500 mt-3" aria-live="polite">
        {searching
          ? `${matching.length} matching signal${matching.length === 1 ? "" : "s"}`
          : expanded
          ? `All ${matching.length} signals${vaccine === "All" ? "" : ` for ${vaccine}`}`
          : `Top ${rows.length} of ${matching.length}${vaccine === "All" ? "" : ` for ${vaccine}`}`}
      </p>

      {rows.length === 0 && (
        <p className="mt-3 text-sm text-slate-600 p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center">
          No flagged signal matches &quot;{query}&quot;{vaccine === "All" ? "" : ` for ${vaccine}`}. It may not have met all three criteria.
        </p>
      )}

      <ol
        className={`mt-2 space-y-1 ${expanded ? "max-h-[30rem] overflow-y-auto pr-1 -mr-1" : ""}`}
        aria-label="Flagged symptoms"
      >
        {rows.map((s, i) => {
          const value = s[sortKey];
          const isSelected = s.id === selected?.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setSelectedId(s.id)}
                aria-pressed={isSelected}
                title={`${s.symptom} (${s.vaccine}): ${s.reports.toLocaleString("en-US")} reports, PRR ${s.prr}`}
                className={`w-full grid grid-cols-1 sm:grid-cols-[minmax(0,15rem)_1fr] gap-x-3 gap-y-1 items-center text-left rounded-lg px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                  isSelected ? "bg-indigo-50" : "hover:bg-slate-50"
                }`}
              >
                <span className="min-w-0 text-xs sm:text-sm text-slate-700 leading-tight">
                  <span className="text-slate-400 tabular-nums mr-1.5">{i + 1}.</span>
                  <span className="font-medium">{s.symptom}</span>
                  {vaccine === "All" && <span className="text-slate-400"> · {s.vaccine}</span>}
                </span>
                <span className="flex items-center gap-2 min-w-0">
                  <span className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <span
                      className={`block h-full rounded-full transition-[width] duration-500 ${
                        isSelected ? "bg-indigo-700" : "bg-indigo-400"
                      }`}
                      style={{ width: `${(value / max) * 100}%` }}
                    />
                  </span>
                  <span className="text-xs tabular-nums text-slate-600 w-16 text-right shrink-0">
                    {sortKey === "reports" ? value.toLocaleString("en-US") : `${value.toFixed(1)}×`}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {!searching && matching.length > TOP_N && (
        <button
          type="button"
          onClick={() => {
            setShowAll((v) => !v);
            if (!showAll) track("signal_explorer_show_all", { vaccine });
            setSelectedId(null);
          }}
          aria-expanded={showAll}
          className="mt-3 w-full py-2 rounded-lg border border-indigo-200 bg-indigo-50/50 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          {showAll ? `Show top ${TOP_N} only` : `Show all ${matching.length} signals`}
        </button>
      )}

      <p className="text-xs text-slate-400 mt-3">
        {sortKey === "reports"
          ? "Bars show the number of VAERS reports mentioning the symptom."
          : "Bars show the PRR: how many times more often the symptom is reported for this vaccine than for the others."}
      </p>

      {selected && <SignalDetail s={selected} />}
    </section>
  );
}

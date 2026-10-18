"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import results from "@/data/eval-results.json";
import { LOGOS } from "@/components/architecture/logos";
import { track } from "@/lib/analytics";

type ModelResult = (typeof results.models)[number];

// One fixed color per model everywhere on the page (validated for color-blind separation).
// The judge is always amber.
const NAMES: Record<string, { name: string; company: string; color: string }> = {
  "google/gemini-3.8-flash": { name: "Gemini 3.8 Flash", company: "Google", color: "#1D4ED8" },
  "meta-llama/llama-3.3-70b-instruct": { name: "Llama 3.3 70B", company: "Meta", color: "#0D9488" },
  "nvidia/nemotron-3-super-120b-a12b:free": { name: "Nemotron 3 Super", company: "NVIDIA · free", color: "#C026D3" },
};
const JUDGE_COLOR = "#F59E0B";
const label = (m: ModelResult) => NAMES[m.model] ?? { name: m.model, company: "", color: "#64748B" };

interface Metric {
  key: string;
  tab: string;
  title: string;
  better: "lower" | "higher";
  value: (m: ModelResult) => number;
  format: (v: number) => string;
  note: string;
}

const METRICS: Metric[] = [
  {
    key: "unsupported",
    tab: "Made-up claims",
    title: "Share of summary claims the judge found unsupported",
    better: "lower",
    value: (m) => m.summaries.unsupportedRatePct ?? 0,
    format: (v) => `${v.toFixed(1)}%`,
    note: "Every sentence of every summary was checked against the reports it cited.",
  },
  {
    key: "passed",
    tab: "Clean summaries",
    title: "Summaries with zero unsupported claims",
    better: "higher",
    value: (m) => (m.summaries.passed / m.summaries.judged) * 100,
    format: (v) => `${Math.round(v)}%`,
    note: "One unsupported sentence is enough to fail a summary. The judge is deliberately strict.",
  },
  {
    key: "outcome",
    tab: "Wrong outcomes",
    title: "Times the outcome was misstated (e.g. an ER visit called an admission)",
    better: "lower",
    value: (m) => (m.summaries.categories as Record<string, number>)["wrong outcome"] ?? 0,
    format: (v) => `${v}`,
    note: "Outcome errors matter most in drug safety: they can make a case look more or less serious than it was.",
  },
  {
    key: "causation",
    tab: "Causation claims",
    title: "Sentences implying the vaccine caused the event",
    better: "lower",
    value: (m) => m.summaries.causalLanguageFlags,
    format: (v) => `${v}`,
    note: "The instructions forbid this outright. VAERS reports show timing, not cause.",
  },
  {
    key: "extraction",
    tab: "Fact extraction",
    title: "Fields extracted correctly from the 20 golden reports",
    better: "higher",
    value: (m) => m.extraction.accuracyPct ?? 0,
    format: (v) => `${Math.round(v)}%`,
    note: "Age, sex, symptoms, timing and outcome, scored against the hand-verified answer key.",
  },
  {
    key: "speed",
    tab: "Speed",
    title: "Average seconds per response",
    better: "lower",
    value: (m) => m.avgLatencyMs / 1000,
    format: (v) => `${v.toFixed(1)}s`,
    note: "Measured on every call in the run.",
  },
  {
    key: "cost",
    tab: "Cost",
    title: "Average cost per summary (USD)",
    better: "lower",
    value: (m) => m.avgCostPerSummaryUsd ?? 0,
    format: (v) => (v === 0 ? "$0" : `$${v.toFixed(4)}`),
    note: "Actual billed cost reported by OpenRouter. Nemotron ran on a free tier.",
  },
];

// The judge only appears where the comparison is meaningful (speed and cost), never in quality scores.
const JUDGE_ROW: Record<string, number> = {
  speed: results.judgeStats.avgLatencyMs / 1000,
  cost: results.judgeStats.totalCostUsd / results.judgeStats.calls,
};

function MetricChart({ metric }: { metric: Metric }) {
  const rows = results.models.map((m) => ({ m, v: metric.value(m) }));
  const judgeValue = JUDGE_ROW[metric.key];
  const max = Math.max(...rows.map((r) => r.v), judgeValue ?? 0, metric.key === "passed" || metric.key === "extraction" ? 100 : 0) || 1;
  const best = metric.better === "lower" ? Math.min(...rows.map((r) => r.v)) : Math.max(...rows.map((r) => r.v));

  return (
    <div key={metric.key} className="wf-fade-up">
      <p className="text-sm font-semibold text-slate-800">{metric.title}</p>
      <p className="text-xs text-slate-500 mb-4">{metric.better === "lower" ? "Lower is better" : "Higher is better"}</p>
      <ul className="space-y-3">
        {rows.map(({ m, v }) => {
          const { name, company } = label(m);
          const isBest = v === best;
          return (
            <li
              key={m.model}
              title={`${name}: ${metric.format(v)}`}
              className="grid grid-cols-[8.5rem_1fr_4.5rem] sm:grid-cols-[11rem_1fr_5rem] items-center gap-3"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-800 truncate">{name}</span>
                <span className="block text-[11px] text-slate-400">{company}</span>
              </span>
              <span className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <span
                  className="block h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${Math.max((v / max) * 100, v > 0 ? 2 : 0)}%`,
                    backgroundColor: label(m).color,
                    opacity: isBest ? 1 : 0.55,
                  }}
                />
              </span>
              <span className={`text-sm tabular-nums text-right ${isBest ? "font-bold text-indigo-700" : "text-slate-600"}`}>
                {metric.format(v)}
              </span>
            </li>
          );
        })}
        {judgeValue !== undefined && (
          <li
            title={`Judge, Claude Sonnet 5.5: ${metric.format(judgeValue)} per check`}
            className="grid grid-cols-[8.5rem_1fr_4.5rem] sm:grid-cols-[11rem_1fr_5rem] items-center gap-3 pt-3 border-t border-dashed border-amber-200"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-800 truncate">
                <span aria-hidden="true">⚖️ </span>Claude Sonnet 5.5
              </span>
              <span className="block text-[11px] font-semibold text-amber-700">Judge · per check</span>
            </span>
            <span className="h-4 bg-amber-50 rounded-full overflow-hidden">
              <span className="block h-full rounded-full bg-amber-500" style={{ width: `${(judgeValue / max) * 100}%` }} />
            </span>
            <span className="text-sm tabular-nums text-right text-amber-800">{metric.format(judgeValue)}</span>
          </li>
        )}
      </ul>
      <p className="text-xs text-slate-500 mt-4">
        {metric.note}
        {judgeValue !== undefined && " The judge isn't ranked; it's shown for comparison."}
      </p>
    </div>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600" aria-label="Legend">
      {results.models.map((m) => (
        <li key={m.model} className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: label(m).color }} aria-hidden="true" />
          {label(m).name}
        </li>
      ))}
      <li className="inline-flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: JUDGE_COLOR }} aria-hidden="true" />
        ⚖️ Judge (speed and cost only)
      </li>
    </ul>
  );
}

// Company logo shown on each bar.
const MODEL_LOGO: Record<string, keyof typeof LOGOS> = {
  "google/gemini-3.8-flash": "googlegemini",
  "meta-llama/llama-3.3-70b-instruct": "meta",
  "nvidia/nemotron-3-super-120b-a12b:free": "nvidia",
};

function BarLogo({ slug }: { slug: keyof typeof LOGOS }) {
  const logo = LOGOS[slug];
  return (
    <span className="w-5 h-5 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0" title={logo.title}>
      <svg viewBox="0 0 24 24" className="w-3 h-3" role="img" aria-label={logo.title}>
        <path d={logo.path} fill={logo.hex} />
      </svg>
    </span>
  );
}

interface Bar {
  key: string;
  name: string;
  color: string;
  logo: keyof typeof LOGOS;
  value: number;
  text: string;
  best?: boolean;
}

function GroupedBars({ groups, max, height = "h-56", unitTicks }: {
  groups: { label: string; hint: string; bars: Bar[] }[];
  max: number;
  height?: string;
  unitTicks?: string[];
}) {
  return (
    <div className="flex gap-2">
      {unitTicks && (
        <div className={`${height} flex flex-col justify-between text-[10px] text-slate-400 tabular-nums pr-1 pb-0`} aria-hidden="true">
          {unitTicks.map((tick) => (
            <span key={tick} className="leading-none">{tick}</span>
          ))}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className={`relative ${height} flex items-end gap-3 sm:gap-5 border-b border-slate-300`}>
          {unitTicks &&
            unitTicks.map((tick, i) => (
              <span
                key={tick}
                className="absolute left-0 right-0 border-t border-slate-100"
                style={{ bottom: `${100 - (i / (unitTicks.length - 1)) * 100}%` }}
                aria-hidden="true"
              />
            ))}
          {groups.map((g) => (
            <div
              key={g.label}
              className="relative flex-1 h-full flex items-end justify-center gap-1"
              role="img"
              aria-label={`${g.label}: ${g.bars.map((b) => `${b.name} ${b.text}`).join(", ")}`}
            >
              {g.bars.map((b) => (
                <div key={b.key} className="flex-1 max-w-[2.75rem] h-full flex flex-col items-center justify-end min-w-0" title={`${b.name}: ${b.text}`}>
                  <span className={`text-[10px] tabular-nums leading-none mb-1 ${b.best ? "font-bold text-slate-900" : "text-slate-500"}`}>
                    {b.text}
                  </span>
                  <BarLogo slug={b.logo} />
                  <span
                    className="w-full rounded-t-[4px] mt-1"
                    style={{ height: `${Math.max((b.value / max) * 82, b.value > 0 ? 2 : 0.5)}%`, backgroundColor: b.color }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-3 sm:gap-5 mt-2">
          {groups.map((g) => (
            <div key={g.label} className="flex-1 text-center min-w-0">
              <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-tight">{g.label}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{g.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const pctOfSummaries = (n: number, judged: number) => (n / judged) * 100;

// Five quality measures, all true percentages, on one shared 0–100% scale.
const QUALITY = [
  {
    label: "Made-up claims",
    hint: "% of claims · lower is better",
    better: "lower",
    value: (m: ModelResult) => m.summaries.unsupportedRatePct ?? 0,
  },
  {
    label: "Clean summaries",
    hint: "% passing · higher is better",
    better: "higher",
    value: (m: ModelResult) => (m.summaries.passed / m.summaries.judged) * 100,
  },
  {
    label: "Wrong outcomes",
    hint: "% of summaries with one · lower is better",
    better: "lower",
    value: (m: ModelResult) => pctOfSummaries(m.summaries.summariesWithWrongOutcome, m.summaries.judged),
  },
  {
    label: "Causation claims",
    hint: "% of summaries with one · lower is better",
    better: "lower",
    value: (m: ModelResult) => pctOfSummaries(m.summaries.summariesWithCausation, m.summaries.judged),
  },
  {
    label: "Fact extraction",
    hint: "% correct · higher is better",
    better: "higher",
    value: (m: ModelResult) => m.extraction.accuracyPct ?? 0,
  },
] as const;

function modelBar(m: ModelResult, value: number, text: string, best: boolean): Bar {
  return { key: m.model, name: label(m).name, color: label(m).color, logo: MODEL_LOGO[m.model], value, text, best };
}

function QualityChart() {
  const groups = QUALITY.map((q) => {
    const vals = results.models.map((m) => q.value(m));
    const best = q.better === "lower" ? Math.min(...vals) : Math.max(...vals);
    return {
      label: q.label,
      hint: q.hint,
      bars: results.models.map((m, i) => {
        const v = vals[i];
        const rounded = v < 20 && v % 1 !== 0 ? v.toFixed(1) : Math.round(v).toString();
        return modelBar(m, v, `${rounded}%`, v === best);
      }),
    };
  });
  return (
    <figure>
      <figcaption className="text-sm font-semibold text-slate-800">Quality, on one 0–100% scale</figcaption>
      <p className="text-xs text-slate-500 mb-4">Bar heights share one 0–100 scale. Bold marks the best model on each measure.</p>
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="min-w-[34rem]">
          <GroupedBars groups={groups} max={100} />
        </div>
      </div>
    </figure>
  );
}

function SpeedCostChart() {
  const judgeBar = (value: number, text: string): Bar => ({
    key: "judge",
    name: "Judge · Claude Sonnet 5.5",
    color: JUDGE_COLOR,
    logo: "anthropic",
    value,
    text,
  });
  const panel = (title: string, hint: string, value: (m: ModelResult) => number, fmt: (v: number) => string, judgeValue: number) => {
    const vals = results.models.map(value);
    const best = Math.min(...vals);
    const bars = [...results.models.map((m, i) => modelBar(m, vals[i], fmt(vals[i]), vals[i] === best)), judgeBar(judgeValue, fmt(judgeValue))];
    return { label: title, hint, bars, max: Math.max(...bars.map((b) => b.value)) || 1 };
  };
  const speed = panel("Speed", "seconds per response · lower is better", (m) => m.avgLatencyMs / 1000, (v) => `${v.toFixed(1)}s`, JUDGE_ROW.speed);
  const cost = panel(
    "Cost",
    "USD per summary or check · lower is better",
    (m) => m.avgCostPerSummaryUsd ?? 0,
    (v) => (v === 0 ? "$0" : v < 0.001 ? `$${v.toFixed(4)}` : `$${v.toFixed(3)}`),
    JUDGE_ROW.cost
  );
  return (
    <figure className="mt-6">
      <figcaption className="text-sm font-semibold text-slate-800">Speed and cost, including the judge</figcaption>
      <p className="text-xs text-slate-500 mb-4">Two panels, each on its own scale. The judge is shown for comparison and isn&apos;t ranked.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[speed, cost].map((p) => (
          <GroupedBars key={p.label} groups={[{ label: p.label, hint: p.hint, bars: p.bars }]} max={p.max} height="h-44" />
        ))}
      </div>
    </figure>
  );
}

function ScorecardCharts() {
  return (
    <div className="mt-3">
      <Legend />
      <div className="mt-4">
        <QualityChart />
        <SpeedCostChart />
      </div>
    </div>
  );
}

export default function EvalResults() {
  const [metricKey, setMetricKey] = useState(METRICS[0].key);
  const metric = METRICS.find((m) => m.key === metricKey)!;

  const byRate = [...results.models].sort((a, b) => (a.summaries.unsupportedRatePct ?? 0) - (b.summaries.unsupportedRatePct ?? 0));
  const winner = byRate[0];
  const othersAvg = byRate.slice(1).reduce((n, m) => n + (m.summaries.unsupportedRatePct ?? 0), 0) / (byRate.length - 1);
  const ratio = othersAvg / (winner.summaries.unsupportedRatePct ?? 1);
  const totalClaims = results.models.reduce((n, m) => n + m.summaries.totalClaims, 0);
  const totalSummaries = results.models.reduce((n, m) => n + m.summaries.judged, 0);

  return (
    <section className="w-full space-y-4 text-left">
      {/* Verdict */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-100 text-xs font-semibold uppercase tracking-wider">
          <Trophy className="w-4 h-4" aria-hidden="true" /> Result
        </div>
        <p className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
          {label(winner).name} made about {ratio.toFixed(1)}× fewer made-up claims than the other two models.
        </p>
        <p className="text-sm text-indigo-100 mt-2">
          It&apos;s slower and costs more, but in drug safety a summary you can trust beats a fast one. Even so, about half its
          summaries still had at least one unsupported sentence, which is why a person reviews every one.
        </p>
        <dl className="mt-4 grid grid-cols-3 gap-2">
          {[
            { v: results.models.length.toString(), l: "AI models compared" },
            { v: totalSummaries.toString(), l: "summaries judged" },
            { v: totalClaims.toLocaleString("en-US"), l: "claims checked" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-white/10 p-3">
              <dd className="text-lg sm:text-2xl font-extrabold tabular-nums">{s.v}</dd>
              <dt className="text-[11px] sm:text-xs text-indigo-100 leading-tight">{s.l}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Interactive metric chart */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Compare the models</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Pick what matters to you. The best model on each measure is highlighted.</p>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choose a measure">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => {
                setMetricKey(m.key);
                track("eval_metric_selected", { metric: m.key });
              }}
              aria-pressed={metricKey === m.key}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                metricKey === m.key
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              {m.tab}
            </button>
          ))}
        </div>
        <div className="mt-5">
          <MetricChart metric={metric} />
        </div>
      </div>

      {/* Full scorecard */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Full scorecard</h2>
        <ScorecardCharts />
        <div className="mt-5 overflow-x-auto -mx-1">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                <th className="py-2 px-1 font-semibold">Measure</th>
                {results.models.map((m) => (
                  <th key={m.model} className="py-2 px-1 font-semibold text-right">
                    {label(m).name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((metric) => {
                const vals = results.models.map((m) => metric.value(m));
                const best = metric.better === "lower" ? Math.min(...vals) : Math.max(...vals);
                return (
                  <tr key={metric.key} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 px-1 text-slate-700">
                      {metric.tab}
                      <span className="text-slate-400 text-xs"> ({metric.better} is better)</span>
                    </td>
                    {vals.map((v, i) => (
                      <td key={i} className={`py-2 px-1 text-right tabular-nums ${v === best ? "font-bold text-indigo-700" : "text-slate-600"}`}>
                        {metric.format(v)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

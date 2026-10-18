"use client";

import { useState } from "react";
import {
  Hammer,
  Database,
  Sigma,
  Sparkles,
  Gavel,
  UserCheck,
  Globe,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type Status = "Live" | "Demo" | "Planned";

interface Part {
  name: string;
  status: Status;
}

interface Layer {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: "slate" | "cyan" | "indigo" | "violet" | "amber" | "emerald";
  parts: Part[];
  details: string[];
}

const LAYERS: Layer[] = [
  {
    id: "data",
    title: "1 · Data",
    subtitle: "Raw reports in, clean reports out",
    icon: Database,
    tone: "slate",
    parts: [
      { name: "Kaggle VAERS CSV · 890,836 rows", status: "Live" },
      { name: "Python + DuckDB", status: "Live" },
    ],
    details: [
      "1 GB file, January–November 2021, processed locally on a laptop.",
      "Rows merged by report ID into 632,708 unique reports; vaccine makers normalized to Pfizer-BioNTech, Moderna, Janssen.",
    ],
  },
  {
    id: "stats",
    title: "2 · Statistics engine",
    subtitle: "Finds what's unusual. No AI.",
    icon: Sigma,
    tone: "cyan",
    parts: [
      { name: "2×2 contingency tables", status: "Live" },
      { name: "PRR · ROR + 95% CI · Yates χ²", status: "Live" },
      { name: "Evans criteria", status: "Live" },
    ],
    details: [
      "Every symptom × vaccine pair gets a 2×2 table: this vaccine vs the other two, symptom vs no symptom.",
      "Flag only if PRR ≥ 2, χ² ≥ 4 (p < 0.05) and at least 30 reports. Ranked by χ²; the top 150 signals are kept.",
      "Deterministic code, so the same data always gives the same flags.",
    ],
  },
  {
    id: "ai",
    title: "3 · AI layer",
    subtitle: "Reads the reports behind each flag",
    icon: Sparkles,
    tone: "indigo",
    parts: [
      { name: "OpenRouter gateway", status: "Live" },
      { name: "Transformer LLMs: Gemini · Llama · Nemotron", status: "Live" },
      { name: "Versioned prompts (v1)", status: "Live" },
    ],
    details: [
      "Large language models (transformer neural networks) summarize the reports behind a signal and extract age, sex, symptoms, timing and outcome.",
      "Guardrails in the prompt: cite a report for every claim, write \"not reported\" instead of guessing, never claim the vaccine caused an event.",
      "One gateway (OpenRouter) gives access to models from several companies, so models can be swapped without code changes.",
    ],
  },
  {
    id: "eval",
    title: "4 · Evaluation",
    subtitle: "Can the AI be trusted?",
    icon: Gavel,
    tone: "amber",
    parts: [
      { name: "Golden set · 20 human-verified reports", status: "Live" },
      { name: "LLM-as-judge · Claude Sonnet 5.5 (blind)", status: "Live" },
      { name: "Scorecard: accuracy, made-up claims, speed, cost", status: "Live" },
    ],
    details: [
      "Python rules pre-fill the answer key; a person checks every field (human-verified labeling).",
      "A judge model from a fourth company checks each summary sentence against its cited reports, without knowing which model wrote it.",
      "Results decide which model to use. Rerunnable with one command when prompts or models change.",
    ],
  },
  {
    id: "hitl",
    title: "5 · Human-in-the-loop",
    subtitle: "A person makes every decision",
    icon: UserCheck,
    tone: "emerald",
    parts: [
      { name: "Approve · Edit · Reject (with reason)", status: "Demo" },
      { name: "Audit log of every decision", status: "Demo" },
      { name: "Rejection reasons → prompt improvements", status: "Planned" },
    ],
    details: [
      "A drug safety officer reviews each AI summary next to the original reports before anything is acted on.",
      "Causality, confounders and escalation are human judgments the AI never makes.",
      "On this site the review step is an interactive demo; a production queue is the next build.",
    ],
  },
  {
    id: "delivery",
    title: "6 · Delivery",
    subtitle: "What visitors see",
    icon: Globe,
    tone: "violet",
    parts: [
      { name: "Next.js + Tailwind site", status: "Live" },
      { name: "Vercel hosting", status: "Live" },
      { name: "PostHog product analytics", status: "Live" },
    ],
    details: [
      "The site reads small JSON snapshots of the results, so it makes no live AI calls and holds no API keys.",
      "PostHog tracks which pages people read and how many finish the reviewer exercise.",
    ],
  },
];

const SECURITY: Part[] = [
  { name: "API key kept server-side, never in the browser", status: "Live" },
  { name: "Key in a git-ignored file, never committed", status: "Live" },
  { name: "Per-key spending cap, no auto top-up", status: "Live" },
  { name: "No keys on the public site", status: "Live" },
  { name: "Public, de-identified data only", status: "Live" },
  { name: "Role-based access: Viewer · Reviewer · Safety lead · Admin", status: "Planned" },
];

const BUILD_TOOLS: Part[] = [
  { name: "Antigravity (AI coding IDE)", status: "Live" },
  { name: "Claude (AI coding assistant)", status: "Live" },
];

const TONES: Record<Layer["tone"], { card: string; icon: string }> = {
  slate: { card: "border-slate-200", icon: "bg-slate-100 text-slate-700" },
  cyan: { card: "border-cyan-200", icon: "bg-cyan-50 text-cyan-800" },
  indigo: { card: "border-indigo-200", icon: "bg-indigo-50 text-indigo-700" },
  amber: { card: "border-amber-300", icon: "bg-amber-50 text-amber-700" },
  emerald: { card: "border-emerald-200", icon: "bg-emerald-50 text-emerald-700" },
  violet: { card: "border-violet-200", icon: "bg-violet-50 text-violet-700" },
};

function StatusBadge({ status }: { status: Status }) {
  const style =
    status === "Live"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Demo"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : "bg-white text-slate-500 border-slate-300 border-dashed";
  return <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${style}`}>{status}</span>;
}

function Chip({ part }: { part: Part }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${
        part.status === "Planned" ? "bg-slate-50 border-dashed border-slate-300 text-slate-500" : "bg-white border-slate-200 text-slate-700"
      }`}
    >
      {part.name}
      <StatusBadge status={part.status} />
    </span>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-1 text-slate-300" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path d="M12 4v14m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function SystemDiagram() {
  const [open, setOpen] = useState<string | null>("stats");

  return (
    <section aria-label="System architecture" className="w-full text-left">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">System architecture, layer by layer</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          The whole system end to end. Tap a layer for details. Tags show what is live today, what is a demo, and what is planned.
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          <StatusBadge status="Live" />
          <StatusBadge status="Demo" />
          <StatusBadge status="Planned" />
        </div>
      </div>

      {/* Build tooling sits outside the runtime flow */}
      <div className="p-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
            <Hammer className="w-4 h-4" aria-hidden="true" /> Built with AI coding tools
          </span>
          {BUILD_TOOLS.map((p) => (
            <Chip key={p.name} part={p} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_15rem] gap-4">
        {/* Main flow */}
        <ol className="list-none p-0 m-0">
          {LAYERS.map((layer, i) => {
            const Icon = layer.icon;
            const isOpen = open === layer.id;
            const tone = TONES[layer.tone];
            return (
              <li key={layer.id}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : layer.id)}
                  aria-expanded={isOpen}
                  className={`w-full text-left p-4 rounded-2xl bg-white border-2 ${tone.card} shadow-xs transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tone.icon}`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-bold text-slate-900">{layer.title}</p>
                        <span className={`text-slate-400 text-xs transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">
                          ▼
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{layer.subtitle}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {layer.parts.map((p) => (
                          <Chip key={p.name} part={p} />
                        ))}
                      </div>
                      {isOpen && (
                        <ul className="wf-fade-up mt-3 space-y-1.5 text-sm text-slate-700">
                          {layer.details.map((d) => (
                            <li key={d} className="flex gap-2">
                              <span className="text-slate-400" aria-hidden="true">•</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </button>
                {i < LAYERS.length - 1 && <Arrow />}
              </li>
            );
          })}
        </ol>

        {/* Cross-cutting security column */}
        <aside className="p-4 rounded-2xl bg-slate-900 text-white h-fit lg:sticky lg:top-4">
          <p className="flex items-center gap-2 font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-300" aria-hidden="true" /> Security & access
          </p>
          <p className="text-xs text-slate-300 mt-1">Applies across every layer.</p>
          <ul className="mt-3 space-y-2">
            {SECURITY.map((s) => (
              <li key={s.name} className="text-xs leading-snug">
                <span className={s.status === "Planned" ? "text-slate-400" : "text-slate-100"}>{s.name}</span>{" "}
                <span
                  className={`ml-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    s.status === "Planned" ? "border border-dashed border-slate-500 text-slate-400" : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

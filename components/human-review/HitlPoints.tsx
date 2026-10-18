import { Bot, Ban, UserCheck, Scale, Search, ShieldAlert, Gavel, FileCheck2, PencilLine, XCircle } from "lucide-react";

const AI_DOES = [
  "Reads the 3–5 reports behind a flag and drafts a short summary",
  "Cites a report number for every statement",
  "Pulls out age, sex, symptoms, timing and outcome",
  "Writes \"not reported\" instead of guessing",
];

const AI_NEVER = [
  "Decides whether a signal exists (statistics do that)",
  "Says the vaccine caused an event",
  "Approves, closes or escalates a case",
];

const HUMAN_REQUIRED = [
  {
    icon: Scale,
    title: "Judging causality",
    text: "Deciding whether the vaccine plausibly caused the event needs medical judgment: timing, mechanism and other explanations.",
  },
  {
    icon: Search,
    title: "Spotting confounders",
    text: "A past illness, another medicine, or a prior reaction to a different vaccine can explain a case. These are easy to miss in a summary.",
  },
  {
    icon: ShieldAlert,
    title: "Catching AI errors",
    text: "An AI can invent a detail or miss one. A person checks every claim against the cited report before anything is approved.",
  },
  {
    icon: Gavel,
    title: "Accountability",
    text: "Escalating a signal to regulators is a decision a named, qualified person must own. It can't be delegated to software.",
  },
];

const OUTCOMES = [
  { icon: FileCheck2, label: "Approve", text: "The summary is accurate. The signal moves to formal assessment.", tone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { icon: PencilLine, label: "Edit & approve", text: "Fixed by the reviewer. Every edit is logged.", tone: "text-amber-700 bg-amber-50 border-amber-200" },
  { icon: XCircle, label: "Reject", text: "A reason is required. Reasons feed back into prompt improvements.", tone: "text-rose-700 bg-rose-50 border-rose-200" },
];

export function WhoDoesWhat() {
  return (
    <section className="w-full text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Who does what</h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4" aria-hidden="true" />
            </span>
            <p className="font-bold text-slate-900">The AI assistant</p>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
            {AI_DOES.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-emerald-600 font-bold" aria-hidden="true">✓</span>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Ban className="w-3.5 h-3.5" aria-hidden="true" /> Never
          </p>
          <ul className="mt-1.5 space-y-1.5 text-sm text-slate-600">
            {AI_NEVER.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-rose-500 font-bold" aria-hidden="true">✗</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <UserCheck className="w-4 h-4" aria-hidden="true" />
            </span>
            <p className="font-bold text-slate-900">The drug safety officer</p>
          </div>
          <p className="mt-3 text-sm text-slate-700">
            A trained pharmacovigilance reviewer gives the final verdict on every flag. They read the AI summary next to
            the original reports and choose one of three outcomes:
          </p>
          <ul className="mt-3 space-y-2">
            {OUTCOMES.map((o) => {
              const Icon = o.icon;
              return (
                <li key={o.label} className={`flex items-start gap-2 p-2.5 rounded-lg border ${o.tone}`}>
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-sm">
                    <span className="font-bold">{o.label}:</span> <span className="text-slate-700">{o.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function WhereHumanIsRequired() {
  return (
    <section className="w-full text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Where a human must make the call</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
        AI makes review faster. These four decisions stay with a person.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {HUMAN_REQUIRED.map((h) => {
          const Icon = h.icon;
          return (
            <div key={h.title} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <p className="font-bold text-sm sm:text-base text-slate-900">{h.title}</p>
              </div>
              <p className="text-sm text-slate-600 mt-2 leading-snug">{h.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Target, Ghost, Timer, Coins, type LucideIcon } from "lucide-react";

const METRICS: { icon: LucideIcon; title: string; question: string; answer: string }[] = [
  {
    icon: Target,
    title: "Accuracy",
    question: "Did it pull out the right details?",
    answer: "Age, sex, symptoms, timing and outcome are compared field by field with the hand-labeled answer key.",
  },
  {
    icon: Ghost,
    title: "Made-up facts",
    question: "Did it invent anything?",
    answer: "Every sentence must be backed by a report. Missing details should say \"not reported,\" never a guess.",
  },
  {
    icon: Timer,
    title: "Speed",
    question: "How long does a reviewer wait?",
    answer: "Time from request to finished summary. Slow tools get skipped in a busy review queue.",
  },
  {
    icon: Coins,
    title: "Cost",
    question: "What does each review cost?",
    answer: "Price per triaged signal, so the cheapest model that is still trustworthy wins.",
  },
];

export default function WhatWeTest() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="w-full text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">What gets tested</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">Tap a card to see how it&apos;s measured.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {METRICS.map((m, i) => {
          const Icon = m.icon;
          const isOpen = open === i;
          return (
            <button
              key={m.title}
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`group text-left p-4 rounded-2xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                isOpen
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md -translate-y-0.5"
                  : "bg-white border-slate-200 hover:border-indigo-300 hover:-translate-y-0.5 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isOpen ? "bg-white/15 text-white" : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-sm sm:text-base">{m.title}</p>
                  <p className={`text-xs ${isOpen ? "text-indigo-100" : "text-slate-500"}`}>{m.question}</p>
                </div>
              </div>
              {isOpen && <p className="wf-fade-up text-sm mt-3 text-indigo-50">{m.answer}</p>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

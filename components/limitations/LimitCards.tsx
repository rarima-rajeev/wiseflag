"use client";

import { useState } from "react";
import { Megaphone, Copy, Users, Clock, TrendingUp, Scale, type LucideIcon } from "lucide-react";

const LIMITS: { icon: LucideIcon; title: string; short: string; detail: string }[] = [
  {
    icon: Megaphone,
    title: "Anyone can report",
    short: "Reports aren't independently verified.",
    detail: "VAERS is open to anyone, so reports vary in detail and completeness. Mild reactions often go unreported, and lab results are usually missing.",
  },
  {
    icon: Copy,
    title: "Same case, filed twice",
    short: "One event can show up more than once.",
    detail: "A patient and their doctor may both report the same reaction. Reports also capture first impressions, not final diagnoses.",
  },
  {
    icon: Users,
    title: "No count of who got vaccinated",
    short: "So no true risk numbers.",
    detail: "VAERS counts reports, not the number of people vaccinated. WiseFlag can say a symptom is reported more often for one vaccine, never how likely it is to happen.",
  },
  {
    icon: Clock,
    title: "After isn't because",
    short: "Timing doesn't prove cause.",
    detail: "A report means something happened after a shot, not because of it. Many health events happen by coincidence around the same time.",
  },
  {
    icon: TrendingUp,
    title: "2021 was a reporting surge",
    short: "More attention meant more reports.",
    detail: "Media coverage, public awareness and reporting rules for healthcare providers pushed report numbers far above normal for vaccines.",
  },
  {
    icon: Scale,
    title: "Vaccines compared to each other",
    short: "Not to unvaccinated people.",
    detail: "Different groups got different vaccines at different times (for example, teens mostly got Pfizer). Those differences can make a symptom look more or less common, and shared risks get hidden.",
  },
];

export default function LimitCards() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="w-full text-left">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">6 things this data can&apos;t tell you</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">Tap a card to learn why it matters.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LIMITS.map((l, i) => {
          const Icon = l.icon;
          const isOpen = open === i;
          return (
            <button
              key={l.title}
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                isOpen
                  ? "bg-amber-50 border-amber-300 shadow-sm"
                  : "bg-white border-slate-200 hover:border-amber-300 hover:-translate-y-0.5 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-sm sm:text-base text-slate-900">{l.title}</p>
                  <p className="text-xs text-slate-500">{l.short}</p>
                  {isOpen && <p className="wf-fade-up text-sm text-slate-700 mt-2">{l.detail}</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

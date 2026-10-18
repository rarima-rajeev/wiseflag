import { Activity } from "lucide-react";
import { PRODUCT_NAME, REPORT_COUNT_LABEL } from "@/config/cards";
import HeroIllustration from "@/components/illustrations/HeroIllustration";
import flagged from "@/data/flagged-signals.json";
import answerKey from "@/data/answer-key.json";

const HERO_STATS = [
  {
    value: flagged.totalRows.toLocaleString("en-US"),
    label: `data rows → ${flagged.totalReports.toLocaleString("en-US")} unique reports screened`,
  },
  { value: flagged.flaggedTotal.toString(), label: "unusual patterns flagged" },
  { value: flagged.byVaccine.length.toString(), label: "vaccines compared" },
  { value: answerKey.total.toString(), label: "hand-picked test reports" },
];

export default function Hero() {
  return (
    <section aria-label="Hero" className="pt-14 pb-10 sm:pt-20 sm:pb-14 text-center px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Row 1: Logo icon + Name + Descriptor + Badge */}
        <h1 className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-center">
          <span className="inline-flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-sm shrink-0"
              aria-hidden="true"
            >
              <Activity className="w-5 h-5" />
            </span>
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              {PRODUCT_NAME}
            </span>
          </span>

          <span className="text-xl sm:text-2xl font-normal text-slate-500">
            - Vaccine Report Triage
          </span>

          <span className="w-full sm:w-auto inline-flex justify-center mt-1 sm:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#EEF2FF] text-indigo-700 border border-indigo-200">
              HUMAN-IN-THE-LOOP AI
            </span>
          </span>
        </h1>

        {/* Row 2: Subtitle */}
        <p className="mt-5 text-lg sm:text-xl text-slate-600 italic max-w-2xl">
          Statistics find it. AI explains it. A human decides.
        </p>

        {/* Clear vertical gap, then two smaller muted lines */}
        <div className="mt-8 space-y-1 text-center">
          <p className="text-sm sm:text-base text-slate-500">
            Screening {REPORT_COUNT_LABEL} COVID-19 vaccine reports for unusual reporting patterns
          </p>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            VAERS pharmacovigilance
          </p>
        </div>
      </div>

      {/* The whole product in one picture */}
      <div className="max-w-4xl mx-auto mt-10">
        <HeroIllustration className="w-full h-auto drop-shadow-sm" />
      </div>

      {/* Key numbers */}
      <dl className="max-w-4xl mx-auto mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {HERO_STATS.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-2xl sm:text-3xl font-extrabold text-indigo-700 tabular-nums">{s.value}</dd>
            <dd className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

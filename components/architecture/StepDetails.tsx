import { PIPELINE_STEPS, type StepTagType } from "@/config/architecture";

function getTagStyles(tag: StepTagType): string {
  switch (tag) {
    case "Code":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "AI":
      return "bg-[#EEF2FF] text-indigo-700 border-indigo-200";
    case "Human":
      return "bg-cyan-50 text-cyan-800 border-cyan-200";
  }
}

export default function StepDetails() {
  return (
    <section aria-label="Step details" className="w-full max-w-4xl mx-auto py-8">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pipeline Step Details
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Click any step to expand its plain-English explanation and technical specification.
        </p>
      </div>

      <div className="space-y-4">
        {PIPELINE_STEPS.map((step) => (
          <details
            key={step.id}
            id={step.id}
            className="group bg-white border border-slate-200 rounded-2xl shadow-xs p-5 transition-all open:ring-1 open:ring-indigo-100 scroll-mt-20"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#EEF2FF] border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {step.number}
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                  {step.title}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTagStyles(
                    step.tag
                  )}`}
                >
                  {step.tag}
                </span>
                <span
                  className="text-slate-400 group-open:rotate-180 transition-transform duration-200 text-sm font-bold"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </div>
            </summary>

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
              <p className="text-sm sm:text-base text-slate-700 leading-snug">
                {step.plain}
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 leading-snug">
                <span className="font-sans font-semibold text-indigo-700 uppercase tracking-wider text-[11px] block mb-1">
                  Technical:
                </span>
                <p>{step.technical}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

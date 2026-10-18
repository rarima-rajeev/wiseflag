import Link from "next/link";
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

export default function PipelineDiagram() {
  return (
    <section
      aria-label="Processing pipeline"
      className="w-full max-w-6xl mx-auto pt-2 pb-8"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {PIPELINE_STEPS.map((step, index) => {
          const isLast = index === PIPELINE_STEPS.length - 1;

          return (
            <div
              key={step.id}
              className="flex-1 flex flex-col lg:flex-row items-center gap-3"
            >
              <Link
                href={`#${step.id}`}
                className="group w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-400 hover:-translate-y-0.5 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#EEF2FF] border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getTagStyles(
                      step.tag
                    )}`}
                  >
                    {step.tag}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                  {step.title}
                </h2>
                <span className="text-[11px] font-medium text-indigo-600 mt-2 inline-flex items-center gap-1 group-hover:underline">
                  View details <span aria-hidden="true">↓</span>
                </span>
              </Link>

              {/* Arrow connector */}
              {!isLast && (
                <div
                  className="flex items-center justify-center text-slate-400 py-1 lg:py-0 shrink-0"
                  aria-hidden="true"
                >
                  <span className="hidden lg:inline-block text-lg font-bold text-slate-300">
                    →
                  </span>
                  <span className="lg:hidden text-base font-bold text-slate-300">
                    ↓
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

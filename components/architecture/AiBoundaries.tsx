import { AI_BOUNDARIES } from "@/config/architecture";

export default function AiBoundaries() {
  return (
    <section aria-label="AI operational boundaries" className="w-full max-w-4xl mx-auto py-8">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          What the AI May and May Not Do
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Strict operational boundaries defining the model scope and limitations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* May column */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
            <h3 className="text-base font-bold text-slate-900">
              The AI May
            </h3>
          </div>
          <ul className="space-y-3 list-none p-0 m-0">
            {AI_BOUNDARIES.may.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="text-indigo-600 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  ✓
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* May Not column */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" aria-hidden="true" />
            <h3 className="text-base font-bold text-slate-900">
              The AI May Not
            </h3>
          </div>
          <ul className="space-y-3 list-none p-0 m-0">
            {AI_BOUNDARIES.mayNot.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="text-slate-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  ✕
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

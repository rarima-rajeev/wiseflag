import { GUARDRAILS } from "@/config/architecture";

export default function Guardrails() {
  return (
    <section aria-label="System guardrails" className="w-full max-w-4xl mx-auto py-8">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          System Guardrails
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Architectural boundaries that prevent hallucinations and preserve human authority.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GUARDRAILS.map((item) => (
          <div
            key={item.title}
            className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-700 leading-snug">
                {item.plain}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-xs text-slate-600">
              <span className="font-sans font-semibold text-indigo-700 uppercase tracking-wider text-[10px] block mb-0.5">
                Technical:
              </span>
              <p>{item.technical}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

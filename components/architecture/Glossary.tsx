import { GLOSSARY } from "@/config/architecture";

export default function Glossary() {
  return (
    <section aria-label="Terminology glossary" className="w-full max-w-4xl mx-auto py-6">
      <details className="group bg-white border border-slate-200 rounded-2xl shadow-xs p-6 transition-all">
        <summary className="flex items-center justify-between cursor-pointer list-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
              Glossary
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              (9 core pharmacovigilance terms)
            </span>
          </div>
          <span
            className="text-slate-400 group-open:rotate-180 transition-transform duration-200 text-sm font-bold"
            aria-hidden="true"
          >
            ▼
          </span>
        </summary>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <dl className="space-y-3">
            {GLOSSARY.map((item) => (
              <div
                key={item.term}
                className="text-sm leading-snug flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2"
              >
                <dt className="font-bold text-slate-900 shrink-0">
                  {item.term}:
                </dt>
                <dd className="text-slate-600 m-0">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </details>
    </section>
  );
}

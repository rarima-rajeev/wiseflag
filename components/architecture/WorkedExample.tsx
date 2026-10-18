import { WORKED_EXAMPLE } from "@/config/architecture";

export default function WorkedExample() {
  return (
    <section aria-label="Worked example" className="w-full max-w-4xl mx-auto py-8">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-1">
            WORKED EXAMPLE
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {WORKED_EXAMPLE.title}
          </h2>
        </div>

        {/* Vertical timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
          {WORKED_EXAMPLE.steps.map((item) => (
            <div key={item.step} className="relative">
              {/* Dot */}
              <div
                className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#EEF2FF] border border-indigo-200 text-indigo-700 text-[11px] font-bold flex items-center justify-center"
                aria-hidden="true"
              >
                {item.step}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {item.step}. {item.name}
                </p>
                <p className="text-sm sm:text-base text-slate-700 mt-0.5 leading-snug">
                  {item.plain}
                </p>

                {item.technical && (
                  <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg font-mono text-xs text-slate-700 inline-block leading-snug">
                    <span className="font-sans font-semibold text-indigo-700 uppercase tracking-wider text-[10px] mr-1.5">
                      Technical:
                    </span>
                    {item.technical}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Closing note in a muted box */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {WORKED_EXAMPLE.closingNote}
          </p>
        </div>
      </div>
    </section>
  );
}

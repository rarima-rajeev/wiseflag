import Link from "next/link";
import { HOW_WE_KNOW } from "@/config/architecture";

export default function HowWeKnow() {
  return (
    <section aria-label="Validation and evaluations" className="w-full max-w-4xl mx-auto py-8">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          How We Know It Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Empirical validation against expert labels and automated benchmarking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {HOW_WE_KNOW.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-400 hover:-translate-y-0.5 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-snug">
                {item.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
              <span>Explore</span>
              <span
                className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

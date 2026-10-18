import Link from "next/link";
import { getAdjacentNav } from "@/config/cards";

interface PageNavProps {
  currentRoute?: string;
}

export default function PageNav({ currentRoute = "" }: PageNavProps) {
  const { prev, next } = getAdjacentNav(currentRoute);

  return (
    <nav
      aria-label="Previous and next page"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Left card: Previous */}
        <Link
          href={prev.link}
          className="group p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-400 hover:-translate-y-0.5 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-indigo-600 group-hover:text-indigo-700 transition-colors mb-2">
              <span
                className="mr-1.5 inline-block transition-transform duration-200 group-hover:-translate-x-1"
                aria-hidden="true"
              >
                ←
              </span>
              <span>{prev.cueText.replace("← ", "")}</span>
            </div>
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {prev.termLabel}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-950 transition-colors mt-1">
              {prev.title}
            </h3>
          </div>
        </Link>

        {/* Right card: Next */}
        <Link
          href={next.link}
          className="group p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-400 hover:-translate-y-0.5 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 flex flex-col justify-between sm:text-right"
        >
          <div>
            <div className="inline-flex items-center sm:justify-end text-xs font-semibold uppercase tracking-wider text-indigo-600 group-hover:text-indigo-700 transition-colors mb-2">
              <span>{next.cueText.replace(" →", "")}</span>
              <span
                className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </div>
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {next.termLabel}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-950 transition-colors mt-1">
              {next.title}
            </h3>
          </div>
        </Link>
      </div>
    </nav>
  );
}

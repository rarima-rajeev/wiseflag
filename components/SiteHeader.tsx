import Link from "next/link";
import { Activity } from "lucide-react";
import { CARDS, PRODUCT_NAME } from "@/config/cards";

interface SiteHeaderProps {
  currentRoute?: string;
}

export default function SiteHeader({ currentRoute = "" }: SiteHeaderProps) {
  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Product name / logo link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 self-start lg:self-auto text-slate-900 font-bold text-lg hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 rounded-lg py-1 transition-colors shrink-0"
          aria-label={`${PRODUCT_NAME} home`}
        >
          <span
            className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0"
            aria-hidden="true"
          >
            <Activity className="w-4 h-4" />
          </span>
          <span className="tracking-tight">{PRODUCT_NAME}</span>
        </Link>

        {/* All pages, always labeled. Desktop: two rows (5 + 4). Smaller screens: pills wrap. */}
        <nav aria-label="Page sections">
          <ol className="flex flex-wrap lg:grid lg:grid-cols-5 gap-1.5 list-none m-0 p-0">
            {CARDS.map((card) => {
              const isCurrent = card.link === currentRoute;
              return (
                <li key={card.link}>
                  <Link
                    href={card.link}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`w-full inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${
                      isCurrent
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isCurrent ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                      aria-hidden="true"
                    >
                      {card.step}
                    </span>
                    <span>{card.shortLabel}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
}

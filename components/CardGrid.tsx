import Link from "next/link";
import { CARDS } from "@/config/cards";
import CardArt from "@/components/illustrations/CardArt";

export default function CardGrid() {
  return (
    <section aria-label="Sections" className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CARDS.map((card, index) => {
          const Icon = card.icon;

          // 1 column on mobile, 2 on tablet, 3 per row on desktop. The 7th card (PM takeaways)
          // closes the grid as a full-width capstone.
          const layoutClasses = index === CARDS.length - 1 && CARDS.length % 3 === 1 ? "col-span-1 md:col-span-2 lg:col-span-3" : "col-span-1";

          return (
            <Link
              key={card.link}
              href={card.link}
              className={`group flex flex-col justify-between overflow-hidden p-6 sm:p-7 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-400 hover:-translate-y-1 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${layoutClasses}`}
            >
              <div>
                {/* Illustration banner, bleeding to the card edges */}
                <div className="-mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-5 border-b border-slate-100 transition-transform duration-300 group-hover:scale-[1.02] origin-bottom">
                  <CardArt link={card.link} />
                </div>

                {/* Step badge & Icon row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#EEF2FF] border border-indigo-200 text-indigo-700 text-xs font-semibold"
                    aria-label={`Step ${card.step}`}
                  >
                    {card.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:text-indigo-700 group-hover:bg-[#EEF2FF] transition-colors">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>

                {/* Term label */}
                <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-1">
                  {card.termLabel}
                </p>

                {/* Title */}
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                  {card.title}
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm text-slate-600 leading-snug">
                  {card.description}
                </p>
              </div>

              {/* Bottom cue */}
              <div className="pt-5 mt-6 border-t border-slate-100 flex items-center">
                <span className="inline-flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                  Open
                  <span
                    className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

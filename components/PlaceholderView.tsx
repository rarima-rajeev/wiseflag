import { notFound } from "next/navigation";
import SubPageLayout from "@/components/SubPageLayout";
import { getCardByLink } from "@/config/cards";

interface PlaceholderViewProps {
  route: string;
  // Optional page content. When present, it replaces the "being built" note.
  intro?: string;
  illustration?: React.ReactNode;
  // Wider content column, for diagrams that need the room.
  wide?: boolean;
  children?: React.ReactNode;
}

export default function PlaceholderView({ route, intro, illustration, wide = false, children }: PlaceholderViewProps) {
  const card = getCardByLink(route);

  if (!card) {
    notFound();
  }

  const Icon = card.icon;

  return (
    <SubPageLayout currentRoute={route}>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-14 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          {/* Step number badge & icon */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#EEF2FF] border border-indigo-200 text-indigo-700 text-xs font-semibold"
              aria-label={`Step ${card.step}`}
            >
              {card.step}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          {/* Term label */}
          <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-2">
            {card.termLabel}
          </p>

          {/* Semantic H1: Card title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {card.title}
          </h1>

          {/* One muted sentence */}
          <p className="mt-4 text-base text-slate-500">
            {intro ?? (children ? card.description : "This page is being built.")}
          </p>

          {illustration && <div className="mt-8 w-full max-w-md">{illustration}</div>}
        </div>

        {children && (
          <div className={`w-full ${wide ? "max-w-5xl" : "max-w-3xl"} mx-auto mt-10 space-y-6`}>{children}</div>
        )}
      </main>
    </SubPageLayout>
  );
}

import type { Metadata } from "next";
import PlaceholderView from "@/components/PlaceholderView";
import SignalIllustration from "@/components/illustrations/SignalIllustration";
import SignalExplorer from "@/components/flagged/SignalExplorer";
import ReviewerTeaser from "@/components/flagged/ReviewerTeaser";
import HowWeGot150 from "@/components/flagged/HowWeGot150";
import { getCardByLink, PRODUCT_NAME } from "@/config/cards";
import flagged from "@/data/flagged-signals.json";

const ROUTE = "/flagged-symptoms";
const card = getCardByLink(ROUTE);

export const metadata: Metadata = {
  title: `${card ? card.title : "Flagged Symptoms"} - ${PRODUCT_NAME}`,
};

const STATS = [
  {
    value: flagged.totalReports.toLocaleString("en-US"),
    label: `unique reports screened (from ${flagged.totalRows.toLocaleString("en-US")} rows)`,
  },
  { value: flagged.flaggedTotal.toString(), label: "symptom–vaccine pairs flagged" },
  { value: flagged.byVaccine.length.toString(), label: "vaccines compared" },
];

export default function FlaggedSymptomsPage() {
  return (
    <PlaceholderView route={ROUTE} illustration={<SignalIllustration className="w-full h-auto" />}>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-2xl font-extrabold text-slate-900 tabular-nums">{s.value}</p>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      <HowWeGot150 />
      <SignalExplorer />
      <ReviewerTeaser />
    </PlaceholderView>
  );
}

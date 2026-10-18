import type { Metadata } from "next";
import PlaceholderView from "@/components/PlaceholderView";
import AnswerKeyIllustration from "@/components/illustrations/AnswerKeyIllustration";
import ReportBrowser from "@/components/answer-key/ReportBrowser";
import HowTheKeyIsMade from "@/components/answer-key/HowTheKeyIsMade";
import { getCardByLink, PRODUCT_NAME } from "@/config/cards";
import answerKey from "@/data/answer-key.json";

const ROUTE = "/answer-key";
const card = getCardByLink(ROUTE);

export const metadata: Metadata = {
  title: `${card ? card.title : "The Answer Key"} - ${PRODUCT_NAME}`,
};

const STATS = [
  { value: answerKey.total.toString(), label: "real VAERS reports" },
  { value: answerKey.random.toString(), label: "picked at random" },
  { value: answerKey.hard.toString(), label: "picked to be tricky" },
];

export default function AnswerKeyPage() {
  return (
    <PlaceholderView
      route={ROUTE}
      intro="Before trusting an AI, you need the right answers to check it against. These 20 real reports are that answer key."
      illustration={<AnswerKeyIllustration className="w-full h-auto" />}
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-2xl font-extrabold text-slate-900 tabular-nums">{s.value}</p>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      <ReportBrowser />
      <HowTheKeyIsMade />
    </PlaceholderView>
  );
}

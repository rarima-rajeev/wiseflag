import type { Metadata } from "next";
import PlaceholderView from "@/components/PlaceholderView";
import ResultsIllustration from "@/components/illustrations/ResultsIllustration";
import EvalResults from "@/components/evals/EvalResults";
import RealMistakes from "@/components/evals/RealMistakes";
import { FairnessNote, EvalCostChart } from "@/components/evals/Lineup";
import { getCardByLink, PRODUCT_NAME } from "@/config/cards";

const ROUTE = "/eval-results";
const card = getCardByLink(ROUTE);

export const metadata: Metadata = {
  title: `${card ? card.title : "Eval Results"} - ${PRODUCT_NAME}`,
};

export default function EvalResultsPage() {
  return (
    <PlaceholderView route={ROUTE} illustration={<ResultsIllustration className="w-full h-auto" />}>
      <EvalResults />
      <FairnessNote />
      <RealMistakes />
      <EvalCostChart />
    </PlaceholderView>
  );
}

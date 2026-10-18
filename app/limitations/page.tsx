import type { Metadata } from "next";
import PlaceholderView from "@/components/PlaceholderView";
import LimitationsIllustration from "@/components/illustrations/LimitationsIllustration";
import RealityCheck from "@/components/limitations/RealityCheck";
import LimitCards from "@/components/limitations/LimitCards";
import DataJourney from "@/components/limitations/DataJourney";
import MisreadScenarios from "@/components/limitations/MisreadScenarios";
import { getCardByLink, PRODUCT_NAME } from "@/config/cards";

const ROUTE = "/limitations";
const card = getCardByLink(ROUTE);

export const metadata: Metadata = {
  title: `${card ? card.title : "What This Can't Tell You"} - ${PRODUCT_NAME}`,
};

export default function LimitationsPage() {
  return (
    <PlaceholderView
      route={ROUTE}
      intro="Every tool has blind spots. Here's where WiseFlag's are, and why a person always makes the final call."
      illustration={<LimitationsIllustration className="w-full h-auto" />}
    >
      <RealityCheck />
      <LimitCards />
      <MisreadScenarios />
      <DataJourney />
    </PlaceholderView>
  );
}

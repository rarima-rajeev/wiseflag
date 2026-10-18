import type { Metadata } from "next";
import PlaceholderView from "@/components/PlaceholderView";
import TakeawaysIllustration from "@/components/illustrations/TakeawaysIllustration";
import Takeaways from "@/components/takeaways/Takeaways";
import { getCardByLink, PRODUCT_NAME } from "@/config/cards";

const ROUTE = "/product-decisions";
const card = getCardByLink(ROUTE);

export const metadata: Metadata = {
  title: `${card ? card.title : "Product Decisions & Takeaways"} - ${PRODUCT_NAME}`,
};

export default function ProductDecisionsPage() {
  return (
    <PlaceholderView
      route={ROUTE}
      intro="The decisions, trade-offs and lessons behind WiseFlag, seen from the product manager's seat."
      illustration={<TakeawaysIllustration className="w-full h-auto" />}
    >
      <Takeaways />
    </PlaceholderView>
  );
}

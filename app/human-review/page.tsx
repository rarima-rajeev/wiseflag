import type { Metadata } from "next";
import PlaceholderView from "@/components/PlaceholderView";
import HumanReviewIllustration from "@/components/illustrations/HumanReviewIllustration";
import { WhoDoesWhat, WhereHumanIsRequired } from "@/components/human-review/HitlPoints";
import YouBeTheReviewer from "@/components/human-review/YouBeTheReviewer";
import { getCardByLink, PRODUCT_NAME } from "@/config/cards";

const ROUTE = "/human-review";
const card = getCardByLink(ROUTE);

export const metadata: Metadata = {
  title: `${card ? card.title : "The Human Decides"} - ${PRODUCT_NAME}`,
};

export default function HumanReviewPage() {
  return (
    <PlaceholderView
      route={ROUTE}
      intro="The AI speeds up the reading. A drug safety officer makes every decision."
      illustration={<HumanReviewIllustration className="w-full h-auto" />}
    >
      <WhoDoesWhat />
      <YouBeTheReviewer />
      <WhereHumanIsRequired />
    </PlaceholderView>
  );
}

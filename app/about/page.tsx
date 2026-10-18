import type { Metadata } from "next";
import PlaceholderView from "@/components/PlaceholderView";
import AboutIllustration from "@/components/illustrations/AboutIllustration";
import About from "@/components/about/About";
import { getCardByLink, PRODUCT_NAME } from "@/config/cards";

const ROUTE = "/about";
const card = getCardByLink(ROUTE);

export const metadata: Metadata = {
  title: `${card ? card.title : "About & Disclaimers"} - ${PRODUCT_NAME}`,
};

export default function AboutPage() {
  return (
    <PlaceholderView
      route={ROUTE}
      intro="What WiseFlag is, how it was built, where the data comes from, and the fine print."
      illustration={<AboutIllustration className="w-full h-auto" />}
    >
      <About />
    </PlaceholderView>
  );
}

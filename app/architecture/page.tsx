import type { Metadata } from "next";
import PlaceholderView from "@/components/PlaceholderView";
import ArchitectureIllustration from "@/components/illustrations/ArchitectureIllustration";
import ArchitectureFlow from "@/components/architecture/ArchitectureFlow";
import AiVsCode from "@/components/architecture/AiVsCode";
import SystemDiagram from "@/components/architecture/SystemDiagram";
import BuiltWith from "@/components/architecture/BuiltWith";
import { getCardByLink, PRODUCT_NAME } from "@/config/cards";

const ROUTE = "/architecture";
const card = getCardByLink(ROUTE);

export const metadata: Metadata = {
  title: `${card ? card.title : "System Architecture"} - ${PRODUCT_NAME}`,
};

export default function ArchitecturePage() {
  return (
    <PlaceholderView
      route={ROUTE}
      wide
      intro="How WiseFlag is built, end to end: from a raw CSV to a decision a person signs off."
      illustration={<ArchitectureIllustration className="w-full h-auto" />}
    >
      <ArchitectureFlow />
      <AiVsCode />
      <SystemDiagram />
      <BuiltWith />
    </PlaceholderView>
  );
}

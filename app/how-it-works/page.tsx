import type { Metadata } from "next";
import SubPageLayout from "@/components/SubPageLayout";
import HeadingBlock from "@/components/architecture/HeadingBlock";
import PipelineDiagram from "@/components/architecture/PipelineDiagram";
import StepDetails from "@/components/architecture/StepDetails";
import WorkedExample from "@/components/architecture/WorkedExample";
import Guardrails from "@/components/architecture/Guardrails";
import AiBoundaries from "@/components/architecture/AiBoundaries";
import HowWeKnow from "@/components/architecture/HowWeKnow";
import Glossary from "@/components/architecture/Glossary";
import FunnelIllustration from "@/components/illustrations/FunnelIllustration";
import { PRODUCT_NAME } from "@/config/cards";

export const metadata: Metadata = {
  title: `How It Works - ${PRODUCT_NAME}`,
  description:
    "Statistics find unusual patterns. AI explains them. A person makes every decision.",
};

const ROUTE = "/how-it-works";

export default function HowItWorksPage() {
  return (
    <SubPageLayout currentRoute={ROUTE}>
      <main className="flex-1 w-full px-4 sm:px-6">
        {/* Above the fold on desktop: Heading block, summary, 3 roles, pipeline diagram */}
        <HeadingBlock />
        <div className="w-full max-w-3xl mx-auto pb-8">
          <FunnelIllustration className="w-full h-auto" />
        </div>
        <PipelineDiagram />

        {/* Deep dive sections below the fold */}
        <div className="space-y-6 pt-4">
          <StepDetails />
          <WorkedExample />
          <Guardrails />
          <AiBoundaries />
          <HowWeKnow />
          <Glossary />
        </div>
      </main>
    </SubPageLayout>
  );
}

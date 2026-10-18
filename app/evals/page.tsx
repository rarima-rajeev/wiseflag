import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderView from "@/components/PlaceholderView";
import EvalIllustration from "@/components/illustrations/EvalIllustration";
import WhatWentIn from "@/components/evals/WhatWentIn";
import WhatWeTest from "@/components/evals/WhatWeTest";
import SpotTheFakeFact from "@/components/evals/SpotTheFakeFact";
import MethodNote from "@/components/evals/MethodNote";
import { Lineup } from "@/components/evals/Lineup";
import { getCardByLink, PRODUCT_NAME } from "@/config/cards";

const ROUTE = "/evals";
const card = getCardByLink(ROUTE);

export const metadata: Metadata = {
  title: `${card ? card.title : "Can the AI Be Trusted?"} - ${PRODUCT_NAME}`,
};

export default function EvalsPage() {
  return (
    <PlaceholderView route={ROUTE} illustration={<EvalIllustration className="w-full h-auto" />}>
      <Lineup />
      <WhatWentIn />
      <WhatWeTest />
      <SpotTheFakeFact />
      <MethodNote />
      <Link
        href="/eval-results"
        className="group block w-full text-left p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        <span className="block text-xs font-semibold uppercase tracking-wider text-indigo-100">Next</span>
        <span className="block text-lg font-bold mt-0.5">
          See which AI won, and why{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </span>
      </Link>
    </PlaceholderView>
  );
}

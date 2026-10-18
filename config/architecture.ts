// Verify against the processed data before publishing.
export const RAW_ROWS = "890,836";
export const UNIQUE_REPORTS = "632,708";
export const PRR_MIN = 2;
export const CHI_MIN = 4;
export const N_MIN = 30;
export const TOP_N = 150;
export const EX_REPORTS = "22,162";
export const EX_PRR = "6.41";
export const EX_PRR_ROUNDED = "6.4";
export const EX_ROR = "6.85";

export const HEADING = {
  termLabel: "ARCHITECTURE",
  title: "How WiseFlag Works",
  plainSummary:
    "Statistics find unusual patterns. AI explains them. A person makes every decision.",
  roles: [
    {
      title: "Code detects",
      label: "Statistics, deterministic",
    },
    {
      title: "AI explains",
      label: "LLM, constrained",
    },
    {
      title: "A human decides",
      label: "Human-in-the-loop",
    },
  ],
};

export type StepTagType = "Code" | "AI" | "Human";

export interface PipelineStep {
  number: number;
  id: string;
  title: string;
  tag: StepTagType;
  plain: string;
  technical: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    number: 1,
    id: "step-1",
    title: "Clean the data",
    tag: "Code",
    plain:
      "We start with about 890,000 spreadsheet rows. One report can take several rows, so we merge them into about 630,000 unique reports and keep the three COVID-19 vaccines.",
    technical: `Report-level aggregation and deduplication by VAERS_ID, processed locally with DuckDB. Raw rows: ${RAW_ROWS}. Unique reports: ${UNIQUE_REPORTS}.`,
  },
  {
    number: 2,
    id: "step-2",
    title: "Compare vaccines",
    tag: "Code",
    plain:
      "For each symptom, we ask: does it show up more often for one vaccine than for the other two?",
    technical:
      "Disproportionality analysis on a 2x2 contingency table, producing PRR (proportional reporting ratio) and ROR (reporting odds ratio) with 95% confidence intervals.",
  },
  {
    number: 3,
    id: "step-3",
    title: "Flag outliers",
    tag: "Code",
    plain:
      "A symptom is flagged only if it is at least twice as frequent, statistically reliable, and has at least 30 reports.",
    technical: `Screening thresholds: PRR >= ${PRR_MIN}, chi-square >= ${CHI_MIN}, case count >= ${N_MIN}. These follow the Evans screening criteria but use a stricter minimum case count than the published value. The top ${TOP_N} flagged signals are kept for review.`,
  },
  {
    number: 4,
    id: "step-4",
    title: "Explain",
    tag: "AI",
    plain:
      "The AI writes a short summary of the evidence and pulls facts such as age and symptoms out of each report's free text. It must cite report IDs and say 'not reported' when something is missing.",
    technical:
      "LLM-generated evidence summary and structured extraction from the case narrative; grounded generation with citations and an abstention rule.",
  },
  {
    number: 5,
    id: "step-5",
    title: "Decide",
    tag: "Human",
    plain:
      "A person approves, edits, or rejects every AI output. A rejection needs a reason.",
    technical:
      "Human-in-the-loop review with a decision log (demo; stored in the browser, not a production audit trail).",
  },
];

export interface WorkedExampleStep {
  step: number;
  name: string;
  plain: string;
  technical?: string;
}

export const WORKED_EXAMPLE = {
  title: "One signal, start to finish: Moderna and injection site redness",
  steps: [
    {
      step: 1,
      name: "Clean",
      plain: `${EX_REPORTS} Moderna reports mention this symptom.`,
      technical: "Symptom: injection site erythema.",
    },
    {
      step: 2,
      name: "Compare",
      plain: `It appears about ${EX_PRR_ROUNDED} times more often than for the other two vaccines.`,
      technical: `PRR ${EX_PRR}, ROR ${EX_ROR}.`,
    },
    {
      step: 3,
      name: "Flag",
      plain: "It clears all three thresholds, so it is flagged.",
    },
    {
      step: 4,
      name: "Explain",
      plain: "The AI summarizes the evidence and cites example report IDs.",
    },
    {
      step: 5,
      name: "Decide",
      plain:
        "A reviewer recognizes this as a well-known, expected injection-site reaction and records that decision.",
    },
  ] as WorkedExampleStep[],
  closingNote:
    "A flag is a statistical pattern in voluntary reports. It is not proof of harm.",
};

export const GUARDRAILS = [
  {
    title: "Detection is deterministic.",
    plain: "The AI never decides what gets flagged.",
    technical: "Deterministic signal detection.",
  },
  {
    title: "The AI stays grounded.",
    plain: "It uses only the report text it is given and cites its sources.",
    technical: "Grounded generation; no causal claims.",
  },
  {
    title: "A human has the final say.",
    plain: "Nothing is final until a person approves it.",
    technical: "Human-in-the-loop approval gate.",
  },
];

export const AI_BOUNDARIES = {
  may: [
    "Summarize the evidence",
    "Extract fields from report text",
    "Say 'not reported' when a detail is missing",
  ],
  mayNot: [
    "Decide whether a signal exists",
    "Claim the vaccine caused something",
    "Guess missing details",
  ],
};

export const HOW_WE_KNOW = [
  {
    title: "See the answer key",
    link: "/answer-key",
    description: "Twenty real reports I labeled by hand, used to test the AI.",
  },
  {
    title: "See the test results",
    link: "/eval-results",
    description:
      "Three AI models tested on accuracy, made-up facts, speed, and cost.",
  },
];

export const BUILT_WITH = [
  "Python",
  "DuckDB",
  "Next.js",
  "Tailwind CSS",
  "OpenRouter (multiple LLMs)",
];

export const GLOSSARY = [
  {
    term: "Adverse event",
    definition:
      "any health problem reported after a vaccine, whether or not the vaccine caused it.",
  },
  {
    term: "VAERS",
    definition:
      "the US Vaccine Adverse Event Reporting System, a voluntary reporting system; reports are unverified.",
  },
  {
    term: "Pharmacovigilance",
    definition:
      "the monitoring of medicine and vaccine safety after they reach the public.",
  },
  {
    term: "Signal",
    definition:
      "a pattern in reports that deserves a closer look. It is not proof of harm.",
  },
  {
    term: "Disproportionality",
    definition:
      "a symptom reported unusually often for one product compared with others.",
  },
  {
    term: "PRR / ROR",
    definition:
      "two standard measures of how much more often a symptom is reported (ratio and odds ratio).",
  },
  {
    term: "Contingency table",
    definition:
      "a 2x2 count table (symptom or no symptom, this vaccine or the others) used to compute PRR and ROR.",
  },
  {
    term: "Narrative",
    definition: "the free-text description written in a report.",
  },
  {
    term: "Causation vs correlation",
    definition:
      "two things appearing together does not mean one caused the other.",
  },
];

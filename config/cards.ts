import {
  Layers,
  Search,
  ClipboardCheck,
  BarChart3,
  ShieldAlert,
  UserCheck,
  Lightbulb,
  Network,
  Trophy,
  Info,
  type LucideIcon,
} from "lucide-react";

export const PRODUCT_NAME = "WiseFlag";
export const REPORT_COUNT_LABEL = "630,000+";

export interface CardItem {
  step: number;
  termLabel: string;
  title: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  link: string;
}

export const CARDS: CardItem[] = [
  {
    step: 1,
    termLabel: "ARCHITECTURE",
    title: "How It Works",
    shortLabel: "How It Works",
    description:
      "Statistics detect unusual patterns, AI explains them, and a human makes every decision.",
    icon: Layers,
    link: "/how-it-works",
  },
  {
    step: 2,
    termLabel: "SYSTEM DESIGN",
    title: "System Architecture",
    shortLabel: "System Design",
    description:
      "The end-to-end design: data pipeline, statistics, AI models, evaluation, human review and security.",
    icon: Network,
    link: "/architecture",
  },
  {
    step: 3,
    termLabel: "SIGNAL DETECTION",
    title: "Flagged Symptoms",
    shortLabel: "Flagged Symptoms",
    description:
      "Which symptoms show up far more often for one vaccine than the others? Flagged by statistics, reviewed by a person.",
    icon: Search,
    link: "/flagged-symptoms",
  },
  {
    step: 4,
    termLabel: "HUMAN-IN-THE-LOOP",
    title: "The Human Decides",
    shortLabel: "Human Review",
    description:
      "AI drafts the summary. A drug safety officer checks it and gives the final verdict. Try it yourself.",
    icon: UserCheck,
    link: "/human-review",
  },
  {
    step: 5,
    termLabel: "GOLDEN SET",
    title: "The Answer Key",
    shortLabel: "Answer Key",
    description:
      "Twenty real reports I labeled by hand, used to test the AI.",
    icon: ClipboardCheck,
    link: "/answer-key",
  },
  {
    step: 6,
    termLabel: "EVALS",
    title: "Can the AI Be Trusted?",
    shortLabel: "Eval Setup",
    description:
      "How three AI models were tested: what went in, what was measured, and who graded.",
    icon: BarChart3,
    link: "/evals",
  },
  {
    step: 7,
    termLabel: "EVAL RESULTS",
    title: "Which AI Won, and Why",
    shortLabel: "Eval Results",
    description:
      "Three models, 450 summaries, 7,768 claims checked by a blind judge. The scorecard, real mistakes and costs.",
    icon: Trophy,
    link: "/eval-results",
  },
  {
    step: 8,
    termLabel: "LIMITATIONS",
    title: "What This Can't Tell You",
    shortLabel: "Limitations",
    description:
      "The limits of this data, and how it was processed.",
    icon: ShieldAlert,
    link: "/limitations",
  },
  {
    step: 9,
    termLabel: "PRODUCT THINKING",
    title: "Product Decisions & Takeaways",
    shortLabel: "AI PM Takeaways",
    description:
      "The decisions, trade-offs and lessons behind WiseFlag, from a product manager's seat.",
    icon: Lightbulb,
    link: "/product-decisions",
  },
  {
    step: 10,
    termLabel: "ABOUT",
    title: "About & Disclaimers",
    shortLabel: "About",
    description:
      "What this project is, how it was built, the data and credits, and the fine print.",
    icon: Info,
    link: "/about",
  },
];

export function getCardByLink(link: string): CardItem | undefined {
  return CARDS.find((card) => card.link === link);
}

export function getCardIndexByLink(link: string): number {
  return CARDS.findIndex((card) => card.link === link);
}

export interface NavCardInfo {
  link: string;
  cueText: string;
  termLabel: string;
  title: string;
}

export interface AdjacentNav {
  prev: NavCardInfo;
  next: NavCardInfo;
  currentIndex: number;
}

export function getAdjacentNav(currentLink: string): AdjacentNav {
  const index = getCardIndexByLink(currentLink);

  // Page 1 (index 0, /how-it-works)
  if (index === 0) {
    return {
      prev: {
        link: "/",
        cueText: "← Overview",
        termLabel: "OVERVIEW",
        title: "WiseFlag Overview",
      },
      next: {
        link: CARDS[1].link,
        cueText: "Next →",
        termLabel: CARDS[1].termLabel,
        title: CARDS[1].title,
      },
      currentIndex: 0,
    };
  }

  // Last page (/limitations)
  if (index === CARDS.length - 1) {
    return {
      prev: {
        link: CARDS[index - 1].link,
        cueText: "← Previous",
        termLabel: CARDS[index - 1].termLabel,
        title: CARDS[index - 1].title,
      },
      next: {
        link: "/",
        cueText: "Back to overview →",
        termLabel: "OVERVIEW",
        title: "WiseFlag Overview",
      },
      currentIndex: index,
    };
  }

  // Middle pages
  if (index > 0 && index < CARDS.length - 1) {
    return {
      prev: {
        link: CARDS[index - 1].link,
        cueText: "← Previous",
        termLabel: CARDS[index - 1].termLabel,
        title: CARDS[index - 1].title,
      },
      next: {
        link: CARDS[index + 1].link,
        cueText: "Next →",
        termLabel: CARDS[index + 1].termLabel,
        title: CARDS[index + 1].title,
      },
      currentIndex: index,
    };
  }

  // Fallback for 404 or unrecognized route
  return {
    prev: {
      link: "/",
      cueText: "← Overview",
      termLabel: "OVERVIEW",
      title: "WiseFlag Overview",
    },
    next: {
      link: CARDS[0].link,
      cueText: "Next →",
      termLabel: CARDS[0].termLabel,
      title: CARDS[0].title,
    },
    currentIndex: -1,
  };
}

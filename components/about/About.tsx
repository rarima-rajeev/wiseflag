import { Compass, Hammer, BookOpen, Scale, Linkedin, Globe, Github, ArrowUpRight } from "lucide-react";
import results from "@/data/eval-results.json";
import flagged from "@/data/flagged-signals.json";
import answerKey from "@/data/answer-key.json";

const KAGGLE_URL = "https://www.kaggle.com/datasets/landfallmotto/covid19-vaccine-adverse-reactions-vaers-dataset";

export const LINKS = {
  portfolio: "https://rarima-rajeev.my.canva.site/",
  linkedin: "https://www.linkedin.com/in/rarima-rajeev",
  github: "https://github.com/rarima-rajeev",
};

const runDate = new Date(results.runAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

function Section({ icon: Icon, title, children }: { icon: typeof Compass; title: string; children: React.ReactNode }) {
  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 text-left">
      <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Icon className="w-4 h-4" aria-hidden="true" />
        </span>
        {title}
      </h2>
      <div className="mt-3 text-sm text-slate-700 leading-relaxed">{children}</div>
    </section>
  );
}

const TIMELINE = [
  { step: "Data", text: `${flagged.totalRows.toLocaleString("en-US")} rows of public VAERS data cleaned into ${flagged.totalReports.toLocaleString("en-US")} reports with Python and DuckDB.` },
  { step: "Statistics", text: `Disproportionality analysis flagged ${flagged.flaggedTotal} symptom–vaccine signals, with no AI involved.` },
  { step: "Answer key", text: `${answerKey.total} reports pre-labeled by rules, then every field verified by hand.` },
  { step: "AI eval", text: `${results.models.length} models, ${results.models.reduce((n, m) => n + m.summaries.judged, 0)} summaries, a blind judge. About $${Math.round(results.totalRunCostUsd)} in total.` },
  { step: "This site", text: "Next.js and Tailwind, built with AI coding assistants, deployed on Vercel." },
];

const CREDITS = [
  { what: "Dataset", who: "COVID-19 Vaccine Adverse Reactions (VAERS) Dataset, published on Kaggle", href: KAGGLE_URL },
  { what: "Statistical method", who: "Evans et al. (2001), proportional reporting ratio screening criteria" },
  { what: "AI models", who: "Google, Meta, NVIDIA and Anthropic, accessed through OpenRouter" },
  { what: "Logos", who: "Simple Icons (CC0 icon data)", href: "https://simpleicons.org" },
  { what: "Open-source tools", who: "Next.js, React, Tailwind CSS, Lucide icons, DuckDB, Python" },
];

// Only disclaimers that don't already appear in the banner, footer or Limitations page.
const DISCLAIMERS = [
  {
    title: "Not medical advice",
    text: "Nothing here is a recommendation about any vaccine. Questions about vaccination belong with a healthcare professional.",
  },
  {
    title: "A dated snapshot",
    text: "The data covers January to November 2021 and isn't updated. Medical knowledge has moved on since then.",
  },
  {
    title: "One eval run, one task",
    text: `AI results come from a single run in ${runDate}. Models and their behavior change over time, so a rerun may give different numbers.`,
  },
  {
    title: "No endorsement of any model",
    text: "The ranking reflects this task, these prompts and this ranking rule only. It isn't a general verdict on any model or company.",
  },
  {
    title: "Trademarks",
    text: "Product names and logos belong to their owners and are used only to identify the tools. No sponsorship or endorsement is implied.",
  },
  {
    title: "Independent",
    text: "Not affiliated with the dataset's publisher, any vaccine maker, any regulator or any AI company.",
  },
  {
    title: "Privacy",
    text: "No accounts, forms or personal data. Anonymous usage analytics (PostHog) show which pages are read, to improve the site.",
  },
  {
    title: "Provided as is",
    text: "Numbers are computed by code and checked, but may still contain errors. Corrections are welcome through GitHub.",
  },
];

export default function About() {
  return (
    <div className="space-y-6">
      <Section icon={Compass} title="About this project">
        <p>
          WiseFlag explores one question: how can AI help drug safety teams work through huge volumes of adverse event reports
          without letting AI make the safety decisions?
        </p>
        <p className="mt-2">
          The answer it tests: statistics find unusual patterns, AI explains them, and a human decides. It&apos;s one of a series
          of AI product management projects, each built end to end and evaluated with real data.
        </p>
      </Section>

      <Section icon={Hammer} title="How it was built">
        <ol className="relative border-l-2 border-indigo-100 ml-3 space-y-4 list-none">
          {TIMELINE.map((t, i) => (
            <li key={t.step} className="pl-6 relative">
              <span className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="font-semibold text-slate-900">{t.step}</p>
              <p className="text-slate-600">{t.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section icon={BookOpen} title="Data and credits">
        <dl className="space-y-2">
          {CREDITS.map((c) => (
            <div key={c.what} className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-0.5">{c.what}</dt>
              <dd>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-700">
                    {c.who}
                  </a>
                ) : (
                  c.who
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section icon={Scale} title="Disclaimers">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DISCLAIMERS.map((d) => (
            <li key={d.title} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-semibold text-slate-900">{d.title}</p>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{d.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <section className="w-full rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-5 sm:p-6 text-left">
        <h2 className="text-base sm:text-lg font-bold tracking-tight">More projects and the full case study</h2>
        <p className="text-sm text-indigo-100 mt-1">The write-up, code and other AI product projects live here.</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { label: "Portfolio", href: LINKS.portfolio, icon: Globe },
            { label: "LinkedIn", href: LINKS.linkedin, icon: Linkedin },
            { label: "GitHub", href: LINKS.github, icon: Github },
          ].map((l) => {
            const Icon = l.icon;
            return (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {l.label}
                <ArrowUpRight className="w-4 h-4 ml-auto opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}

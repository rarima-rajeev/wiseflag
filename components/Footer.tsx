const KAGGLE_URL =
  "https://www.kaggle.com/datasets/landfallmotto/covid19-vaccine-adverse-reactions-vaers-dataset";

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 mt-auto border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto text-xs text-slate-500 space-y-6">
        <section aria-label="References" className="text-left sm:text-center space-y-1">
          <h2 className="font-semibold uppercase tracking-wider text-[11px] text-slate-400 mb-2">
            References
          </h2>
          <p>
            Dataset:{" "}
            <a href={KAGGLE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">
              COVID-19 Vaccine Adverse Reactions (VAERS) Dataset
            </a>
            , Kaggle.
          </p>
          <p>VAERS: Vaccine Adverse Event Reporting System.</p>
          <p>Data coverage: January–November 2021.</p>
          <p>VAERS reports are unverified and do not establish that a vaccine caused an event.</p>
        </section>

        <div className="text-center space-y-1 pt-4 border-t border-slate-200/60">
          <p>AI PM portfolio project. Not a validated system.</p>
          <p>
            © 2026 · Built as part of an AI PM portfolio ·{" "}
            <a
              href="https://rarima-rajeev.my.canva.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-700"
            >
              View portfolio →
            </a>
          </p>
          <p>
            Independent portfolio project, not affiliated with Wise or any company of the same name.
          </p>
        </div>
      </div>
    </footer>
  );
}

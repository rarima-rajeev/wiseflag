# WiseFlag

Human-in-the-loop AI triage of COVID-19 vaccine adverse event reports. An AI product management portfolio project.

**Statistics find it. AI explains it. A human decides.**

- **Data:** 890,836 rows of public VAERS data (Kaggle, Jan–Nov 2021), cleaned into 632,708 unique reports.
- **Statistics:** disproportionality analysis (PRR, ROR, Yates χ², Evans criteria) flags 150 symptom–vaccine signals. No AI decides what gets flagged.
- **AI:** three candidate models (Gemini 3.8 Flash, Llama 3.3 70B, Nemotron 3 Super) summarize the reports behind each signal; a blind judge (Claude Sonnet 5.5) checks every claim.
- **Evaluation:** 450 summaries and 7,768 claims checked, plus field extraction against a 20-report hand-verified answer key.
- **Human review:** a drug safety officer approves, edits or rejects every summary.

## Run locally

```bash
npm install
npm run dev
```

The site runs on http://localhost:3003 and reads pre-computed results from `data/`. It makes no live AI calls.

## Re-running the evals (optional)

`scripts/prepare_eval_inputs.py` and `scripts/run-evals.mjs` rebuild the eval inputs and results. They need the raw Kaggle CSV, the original pipeline's data folder, and an OpenRouter key in `.env.local` (never committed). `node scripts/run-evals.mjs --score-only` re-scores saved outputs without any API calls.

## Disclaimer

Portfolio demo only. Not for clinical or public-health decisions. VAERS reports are unverified and do not establish causation. Not affiliated with Wise or any company of the same name.

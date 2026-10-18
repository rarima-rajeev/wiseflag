#!/usr/bin/env node
/**
 * WiseFlag eval runner. Calls OpenRouter; never touches the original SignalScope app.
 *
 *   node scripts/run-evals.mjs               run all model calls, save raw outputs, then score
 *   node scripts/run-evals.mjs --retry-failed  redo only failed, cut-off or unjudged calls, then score
 *        add --skip-extraction to spend a limited daily quota on summaries + judging first
 *   node scripts/run-evals.mjs --score-only  re-score saved outputs (free; picks up newly saved hand labels)
 *
 * Inputs:  data/eval-inputs.json (from prepare_eval_inputs.py), SignalScope prompts/v1 (read-only),
 *          SignalScope data/golden.json (read-only, re-read at score time for the latest hand labels)
 * Outputs: data/eval-raw.json (every prompt response), data/eval-results.json (what the site shows)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SIGNALSCOPE = path.resolve(ROOT, "..", "signalscope");
const PROMPTS = path.join(SIGNALSCOPE, "prompts", "v1");
const RAW_PATH = path.join(ROOT, "data", "eval-raw.json");
const RESULTS_PATH = path.join(ROOT, "data", "eval-results.json");

// ---------- config ----------
function loadEnv() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    process.env[t.slice(0, i).trim()] ??= t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const MODELS = [process.env.OPENROUTER_EVAL_MODEL_A, process.env.OPENROUTER_EVAL_MODEL_B, process.env.OPENROUTER_EVAL_MODEL_C].filter(Boolean);
const JUDGE = process.env.OPENROUTER_JUDGE_MODEL;
// Reasoning judges can spend the whole budget thinking and return nothing; "low" keeps answers coming.
const JUDGE_REASONING = process.env.OPENROUTER_JUDGE_REASONING;
const CONCURRENCY = 3; // low, so in-flight requests don't reserve more credit than the account holds
// Cost guard: once total spend (including earlier runs saved in eval-raw.json) reaches this, no new calls start.
// Calls already in flight finish, so the overshoot is at most a few calls.
const BUDGET_USD = Number(process.env.EVAL_BUDGET_USD ?? 10);
let spentUsd = 0;
// Generous limits: reasoning models spend part of the budget thinking before they answer.
const LIMITS = { extraction: 2000, summary: 3000, judge: 4000 };

// ---------- OpenRouter ----------
async function callOpenRouter(model, prompt, { maxTokens, temperature, reasoning, timeoutMs = 120_000 }) {
  if (spentUsd >= BUDGET_USD) return { ok: false, error: "budget_guard", latencyMs: 0 };
  for (let attempt = 1; attempt <= 3; attempt++) {
    const started = Date.now();
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "WiseFlag Evals",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
          temperature,
          usage: { include: true },
          ...(reasoning ? { reasoning: { effort: reasoning } } : {}),
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      const latencyMs = Date.now() - started;
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      if (!res.ok) return { ok: false, error: body?.error?.message ?? `HTTP ${res.status}`, latencyMs };
      spentUsd += body.usage?.cost ?? 0;
      return {
        ok: true,
        content: body.choices?.[0]?.message?.content ?? "",
        latencyMs,
        costUsd: body.usage?.cost ?? null,
        promptTokens: body.usage?.prompt_tokens ?? null,
        completionTokens: body.usage?.completion_tokens ?? null,
      };
    } catch (err) {
      if (attempt === 3) return { ok: false, error: String(err.message ?? err), latencyMs: Date.now() - started };
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

async function pool(items, worker) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await worker(items[i], i);
      }
    })
  );
  return out;
}

function parseJson(text) {
  if (!text) return null;
  const cleaned = text.replace(/```json|```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

// ---------- prompts (versioned files from SignalScope, read-only) ----------
const tpl = (name) => fs.readFileSync(path.join(PROMPTS, name), "utf-8");

function extractionPrompt(report) {
  return tpl("extract_fields.txt")
    .replace(/{{vaers_id}}/g, report.vaers_id)
    .replace(/{{symptom_text}}/g, report.narrative);
}

function formatReports(reports) {
  // Narrative-only, so the summary can be judged against exactly what the model saw.
  return reports.map((r) => `[Report #${r.vaers_id}]\nNarrative: "${r.narrative}"`).join("\n\n---\n\n");
}

function summaryPrompt(signal) {
  return tpl("summarize_signal.txt")
    .replace(/{{manufacturer}}/g, signal.manufacturer)
    .replace(/{{symptom}}/g, signal.symptom)
    .replace(/{{prr}}/g, String(signal.prr))
    .replace(/{{ror}}/g, String(signal.ror))
    .replace(/{{ci_lower}}/g, String(signal.ci_lower))
    .replace(/{{ci_upper}}/g, String(signal.ci_upper))
    .replace(/{{chi_square}}/g, String(signal.chi_square))
    .replace(/{{case_count}}/g, String(signal.case_count))
    .replace(/{{sample_count}}/g, String(signal.reports.length))
    .replace(/{{reports_text}}/g, formatReports(signal.reports));
}

function judgePrompt(signal, summary) {
  return tpl("judge_faithfulness.txt")
    .replace(/{{source_reports}}/g, formatReports(signal.reports))
    .replace(/{{candidate_summary}}/g, summary);
}

// ---------- single tasks (shared by full run and retry) ----------
async function doExtraction(model, r) {
  const res = await callOpenRouter(model, extractionPrompt(r), { maxTokens: LIMITS.extraction, temperature: 0 });
  process.stdout.write(res.ok ? "." : "x");
  return { model, vaers_id: r.vaers_id, ...res, parsed: res.ok ? parseJson(res.content) : null };
}

async function doSummary(model, s) {
  const res = await callOpenRouter(model, summaryPrompt(s), { maxTokens: LIMITS.summary, temperature: 0.1 });
  process.stdout.write(res.ok ? "." : "x");
  return { model, signal_id: s.id, ...res };
}

async function doJudge(sum, signals) {
  if (!sum.ok) return { ...sum, judge: null };
  const signal = signals.find((s) => s.id === sum.signal_id);
  const res = await callOpenRouter(JUDGE, judgePrompt(signal, sum.content), {
    maxTokens: LIMITS.judge,
    temperature: 0,
    reasoning: JUDGE_REASONING,
    timeoutMs: 300_000,
  });
  process.stdout.write(res.ok ? "." : "x");
  return {
    ...sum,
    judge: { ok: res.ok, error: res.error, latencyMs: res.latencyMs, costUsd: res.costUsd, verdict: res.ok ? parseJson(res.content) : null, rawContent: res.content },
  };
}

async function retryFailed() {
  const inputs = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "eval-inputs.json"), "utf-8"));
  const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf-8"));
  spentUsd = [...raw.extraction, ...raw.summaries, ...raw.summaries.map((s) => s.judge ?? {})].reduce((n, c) => n + (c.costUsd ?? 0), 0);
  console.log(`Already spent $${spentUsd.toFixed(4)} of $${BUDGET_USD} budget`);

  const badExt = process.argv.includes("--skip-extraction") ? [] : raw.extraction.filter((e) => !e.ok || !e.parsed);
  console.log(`Retrying ${badExt.length} extraction calls`);
  const fixedExt = await pool(badExt, (e) => doExtraction(e.model, inputs.golden.find((g) => g.vaers_id === e.vaers_id)));
  raw.extraction = raw.extraction.map((e) => fixedExt.find((f) => f.model === e.model && f.vaers_id === e.vaers_id) ?? e);

  const badSum = raw.summaries.filter((s) => !s.ok);
  console.log(`\nRetrying ${badSum.length} summary calls`);
  const fixedSum = await pool(badSum, (s) => doSummary(s.model, inputs.signals.find((x) => x.id === s.signal_id)));
  raw.summaries = raw.summaries.map((s) => {
    const f = fixedSum.find((x) => x.model === s.model && x.signal_id === s.signal_id);
    return f ? { ...f, judge: null } : s;
  });

  const needJudge = raw.summaries.filter((s) => s.ok && !s.judge?.verdict);
  console.log(`\nJudging ${needJudge.length} summaries`);
  const judged = await pool(needJudge, (s) => doJudge(s, inputs.signals));
  raw.summaries = raw.summaries.map((s) => judged.find((j) => j.model === s.model && j.signal_id === s.signal_id) ?? s);

  raw.finishedAt = new Date().toISOString();
  fs.writeFileSync(RAW_PATH, JSON.stringify(raw, null, 1));
  console.log(`\n\nUpdated raw outputs in ${path.relative(ROOT, RAW_PATH)}`);
}

// ---------- run ----------
async function run() {
  if (!API_KEY.startsWith("sk-or-")) throw new Error("OPENROUTER_API_KEY missing in .env.local");
  if (MODELS.length === 0 || !JUDGE) throw new Error("Set OPENROUTER_EVAL_MODEL_A/B and OPENROUTER_JUDGE_MODEL");
  const inputs = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "eval-inputs.json"), "utf-8"));

  const raw = {
    startedAt: new Date().toISOString(),
    models: MODELS,
    judge: JUDGE,
    promptVersion: "signalscope/prompts/v1",
    extraction: [],
    summaries: [],
  };

  // 1. Extraction: every model on every golden report (cheap, runs first).
  console.log(`Extraction: ${MODELS.length} models x ${inputs.golden.length} golden reports`);
  const extJobs = MODELS.flatMap((model) => inputs.golden.map((r) => ({ model, r })));
  raw.extraction = await pool(extJobs, ({ model, r }) => doExtraction(model, r));

  // 2. Summaries + judge, signal by signal across all models, so a budget stop still
  //    leaves every model evaluated on the same signals.
  console.log(`\nSummaries + judge: ${MODELS.length} models x ${inputs.signals.length} signals (budget $${BUDGET_USD})`);
  const sumJobs = inputs.signals.flatMap((s) => MODELS.map((model) => ({ model, s })));
  const done = new Array(sumJobs.length);
  await pool(sumJobs, async ({ model, s }, i) => {
    done[i] = await doJudge(await doSummary(model, s), inputs.signals);
    if (i % 15 === 0) {
      // Checkpoint, so an interrupted run keeps what it has paid for.
      raw.summaries = done.filter(Boolean);
      fs.writeFileSync(RAW_PATH, JSON.stringify(raw, null, 1));
    }
    return done[i];
  });
  raw.summaries = done.filter(Boolean);
  console.log(`\nSpent this run: $${spentUsd.toFixed(4)}`);

  raw.finishedAt = new Date().toISOString();
  fs.writeFileSync(RAW_PATH, JSON.stringify(raw, null, 1));
  console.log(`\n\nSaved raw outputs to ${path.relative(ROOT, RAW_PATH)}`);
}

// ---------- scoring ----------
const norm = (v) => String(v ?? "not reported").trim().toLowerCase();

function sameField(field, model, truth) {
  if (field === "key_symptoms") {
    const a = (Array.isArray(model) ? model : []).map(norm);
    const b = (Array.isArray(truth) ? truth : []).map(norm);
    if (b.length === 0) return a.length === 0;
    const hit = (x, list) => list.some((y) => x.includes(y) || y.includes(x));
    const recall = b.filter((x) => hit(x, a)).length / b.length;
    const precision = a.length ? a.filter((x) => hit(x, b)).length / a.length : 0;
    return recall >= 0.8 && precision >= 0.5;
  }
  if (field === "age") {
    if (norm(truth) === "not reported") return norm(model) === "not reported";
    return norm(model).replace(/\D/g, "") === norm(truth).replace(/\D/g, "");
  }
  return norm(model) === norm(truth);
}


function score() {
  const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf-8"));
  // Re-read hand labels now, so labels saved after the paid run still count.
  const golden = JSON.parse(fs.readFileSync(path.join(SIGNALSCOPE, "data", "golden.json"), "utf-8")).reports;
  const verified = new Map(golden.filter((g) => g.verification_status === "verified").map((g) => [g.vaers_id, g.hand_labeled_fields]));
  const FIELDS = ["age", "sex", "key_symptoms", "onset_timing", "outcome"];

  const models = raw.models.map((model) => {
    const ext = raw.extraction.filter((e) => e.model === model);
    const sums = raw.summaries.filter((s) => s.model === model);

    let fieldsChecked = 0;
    let fieldsCorrect = 0;
    for (const e of ext) {
      const truth = verified.get(e.vaers_id);
      if (!truth || !e.parsed) continue;
      for (const f of FIELDS) {
        fieldsChecked++;
        if (sameField(f, e.parsed[f], truth[f])) fieldsCorrect++;
      }
    }

    const judged = sums.filter((s) => s.judge?.verdict);
    const totalClaims = judged.reduce((n, s) => n + (Number(s.judge.verdict.total_claims) || 0), 0);
    const unsupported = judged.reduce((n, s) => n + (Number(s.judge.verdict.unsupported_claims_count) || 0), 0);
    const passed = judged.filter((s) => s.judge.verdict.summary_verdict === "pass").length;
    // Causation overclaims come from the judge, which reads each sentence in context.
    // (A keyword match flagged disclaimers like "does not establish that the vaccine caused".)
    const causalHits = judged.reduce(
      (n, s) => n + (s.judge.verdict.unsupported_claims ?? []).filter((u) => /causa/i.test(u.failure_category ?? "")).length,
      0
    );

    // Share of summaries with at least one claim in a category (a true percentage of summaries).
    const summariesWith = (re) =>
      judged.filter((s) => (s.judge.verdict.unsupported_claims ?? []).some((u) => re.test(u.failure_category ?? ""))).length;

    const categories = {};
    for (const s of judged) {
      for (const u of s.judge.verdict.unsupported_claims ?? []) {
        const c = (u.failure_category ?? "other").toLowerCase();
        categories[c] = (categories[c] ?? 0) + 1;
      }
    }

    const calls = [...ext, ...sums].filter((c) => c.ok);
    const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
    const sumCosts = sums.filter((s) => s.ok && s.costUsd != null).map((s) => s.costUsd);

    return {
      model,
      extraction: {
        reportsRun: ext.length,
        parsedOk: ext.filter((e) => e.parsed).length,
        verifiedReportsScored: ext.filter((e) => verified.has(e.vaers_id) && e.parsed).length,
        fieldsChecked,
        fieldsCorrect,
        accuracyPct: fieldsChecked ? Math.round((fieldsCorrect / fieldsChecked) * 1000) / 10 : null,
      },
      summaries: {
        signalsRun: sums.length,
        judged: judged.length,
        passed,
        totalClaims,
        unsupportedClaims: unsupported,
        unsupportedRatePct: totalClaims ? Math.round((unsupported / totalClaims) * 1000) / 10 : null,
        causalLanguageFlags: causalHits,
        categories,
        summariesWithWrongOutcome: summariesWith(/wrong outcome/i),
        summariesWithCausation: summariesWith(/causa/i),
      },
      avgLatencyMs: Math.round(avg(calls.map((c) => c.latencyMs)) ?? 0),
      avgCostPerSummaryUsd: avg(sumCosts),
      totalCostUsd: calls.reduce((n, c) => n + (c.costUsd ?? 0), 0),
      failedCalls: [...ext, ...sums].filter((c) => !c.ok).length,
    };
  });

  const failures = raw.summaries
    .flatMap((s) =>
      (s.judge?.verdict?.unsupported_claims ?? []).map((u) => ({
        model: s.model,
        signal_id: s.signal_id,
        claim: u.claim,
        cited_report: u.cited_report,
        category: u.failure_category,
        reason: u.reason,
      }))
    )
    .slice(0, 12);

  // Curated examples for the site: one per (model, mistake type), preferring serious known signals,
  // skipping the judge quirk where a narrative simply doesn't name the vaccine.
  const inputs = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "eval-inputs.json"), "utf-8"));
  const signalInfo = new Map(inputs.signals.map((s) => [s.id, s]));
  const SERIOUS = /myocarditis|thrombosis|guillain/i;
  const QUIRK = /(do(es)? not|never|don't) (name|state|mention|identify|specify)[^.]{0,40}(vaccine|manufacturer|product|moderna|pfizer|janssen)/i;
  const candidates = raw.summaries.flatMap((s) =>
    (s.judge?.verdict?.unsupported_claims ?? [])
      .filter((u) => u.claim && u.reason && u.reason.length < 420 && !QUIRK.test(u.reason))
      .map((u) => {
        const sig = signalInfo.get(s.signal_id);
        return {
          model: s.model,
          signal: sig ? `${sig.symptom} · ${sig.manufacturer.replace("PFIZER\\BIONTECH", "Pfizer-BioNTech").replace("MODERNA", "Moderna").replace("JANSSEN", "Janssen")}` : s.signal_id,
          serious: SERIOUS.test(sig?.symptom ?? ""),
          category: (u.failure_category ?? "other").toLowerCase(),
          claim: u.claim,
          cited_report: u.cited_report,
          reason: u.reason,
        };
      })
  );
  const examples = [];
  for (const model of raw.models) {
    for (const category of ["overclaimed causation", "wrong outcome", "invented fact", "hallucinated citation"]) {
      const pool = candidates.filter((c) => c.model === model && c.category === category);
      const pick = pool.find((c) => c.serious) ?? pool[0];
      if (pick) examples.push(pick);
    }
  }
  const quirkFlags = candidates.length ? raw.summaries.reduce(
    (n, s) => n + (s.judge?.verdict?.unsupported_claims ?? []).filter((u) => QUIRK.test(u.reason ?? "")).length,
    0
  ) : 0;

  const judgeCost = raw.summaries.reduce((n, s) => n + (s.judge?.costUsd ?? 0), 0);
  const judgeCalls = raw.summaries.filter((s) => s.judge?.ok);
  const judgeStats = {
    model: raw.judge,
    calls: judgeCalls.length,
    claimsChecked: models.reduce((n, m) => n + m.summaries.totalClaims, 0),
    avgLatencyMs: Math.round(judgeCalls.reduce((n, s) => n + (s.judge.latencyMs ?? 0), 0) / (judgeCalls.length || 1)),
    totalCostUsd: judgeCost,
    // The judge prompt contains only the source reports and the summary, never the model's name.
    blind: true,
  };
  const results = {
    mode: "live_openrouter",
    runAt: raw.finishedAt,
    scoredAt: new Date().toISOString(),
    judge: raw.judge,
    promptVersion: raw.promptVersion,
    goldenVerified: verified.size,
    goldenTotal: golden.length,
    signalsEvaluated: new Set(raw.summaries.map((s) => s.signal_id)).size,
    models,
    failures,
    examples,
    judgeQuirkFlags: quirkFlags,
    judgeStats,
    totalRunCostUsd: models.reduce((n, m) => n + m.totalCostUsd, 0) + judgeCost,
  };
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 1));

  console.log(`\nScored -> ${path.relative(ROOT, RESULTS_PATH)}`);
  for (const m of models) {
    console.log(
      `${m.model}\n  extraction: ${m.extraction.accuracyPct ?? "not scored"}% (${m.extraction.fieldsChecked} verified fields; ${m.extraction.parsedOk}/${m.extraction.reportsRun} parsed)` +
        `\n  summaries: ${m.summaries.passed}/${m.summaries.judged} passed, ${m.summaries.unsupportedClaims}/${m.summaries.totalClaims} unsupported claims (${m.summaries.unsupportedRatePct}%), causal-language flags ${m.summaries.causalLanguageFlags}` +
        `\n  avg latency ${m.avgLatencyMs} ms, avg cost/summary ${m.avgCostPerSummaryUsd == null ? "n/a" : "$" + m.avgCostPerSummaryUsd.toFixed(5)}, failed calls ${m.failedCalls}`
    );
  }
  console.log(`Total run cost incl. judge: $${results.totalRunCostUsd.toFixed(4)}`);
}

if (process.argv.includes("--retry-failed")) await retryFailed();
else if (!process.argv.includes("--score-only")) await run();
score();

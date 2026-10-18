#!/usr/bin/env python3
"""
Builds data/eval-inputs.json for scripts/run-evals.mjs. Local only, no API calls.

Reads (never writes) the original SignalScope data and the raw Kaggle VAERS CSV:
  - golden set: 20 reports for the extraction test
  - signals:    all 150 flagged signals (or, with --sample, 12: top 3 per vaccine +
                the 3 known safety signals the pipeline caught), each with 4 real reports

Usage: python3 -I scripts/prepare_eval_inputs.py <signalscope_dir> <vaers_csv> [--sample]
"""
import csv
import json
import os
import sys

REPORTS_PER_SIGNAL = 4
MAX_NARRATIVE = 1500  # same cap the original pipeline used
KNOWN_CAUGHT = [
    ("PFIZER\\BIONTECH", "Myocarditis"),
    ("JANSSEN", "Thrombosis"),
    ("JANSSEN", "Guillain-Barre syndrome"),
]


def manufacturer_of(raw: str) -> str:
    # Same bucketing as signalscope/scripts/process_vaers.py
    up = raw.upper()
    if "MODERNA" in up:
        return "MODERNA"
    if "JANSSEN" in up or "JOHNSON" in up:
        return "JANSSEN"
    return "PFIZER\\BIONTECH"


def pick_signals(signals):
    picked = []
    for m in ["PFIZER\\BIONTECH", "MODERNA", "JANSSEN"]:
        picked += [s for s in signals if s["manufacturer"] == m][:3]
    for m, sym in KNOWN_CAUGHT:
        s = next(s for s in signals if s["manufacturer"] == m and s["symptom"] == sym)
        if s not in picked:
            picked.append(s)
    return picked


def main():
    signalscope_dir, csv_path = sys.argv[1], sys.argv[2]
    data_dir = os.path.join(signalscope_dir, "data")
    signals = json.load(open(os.path.join(data_dir, "signals.json")))
    golden = json.load(open(os.path.join(data_dir, "golden.json")))

    chosen = pick_signals(signals) if "--sample" in sys.argv else signals
    wanted = {(s["manufacturer"], s["symptom"]): [] for s in chosen}
    seen_ids = {k: set() for k in wanted}

    csv.field_size_limit(10**9)
    with open(csv_path, newline="", encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            manu = manufacturer_of(row["VAX_MANU"])
            syms = {row[f"SYMPTOM{i}"] for i in range(1, 6)} - {""}
            for sym in syms:
                key = (manu, sym)
                if key not in wanted or len(wanted[key]) >= REPORTS_PER_SIGNAL:
                    continue
                vid = row["VAERS_ID"]
                text = " ".join(row["SYMPTOM_TEXT"].split())
                if vid in seen_ids[key] or not (120 <= len(text) <= MAX_NARRATIVE):
                    continue
                seen_ids[key].add(vid)
                wanted[key].append({
                    "vaers_id": vid,
                    "age": row["AGE_YRS"] or None,
                    "sex": row["SEX"] or None,
                    "days_to_onset": row["NUMDAYS"] or None,
                    "hospitalized": row["HOSPITAL"] == "Y",
                    "died": row["DIED"] == "Y",
                    "narrative": text,
                })
            if all(len(v) >= REPORTS_PER_SIGNAL for v in wanted.values()):
                break

    out = {
        "source": "Built by scripts/prepare_eval_inputs.py from signalscope/data (read-only) and the Kaggle VAERS CSV.",
        "golden": [
            {
                "vaers_id": r["vaers_id"],
                "narrative": r["symptom_text"],
                "hard": not r["selection_method"].startswith("random"),
                "verified": r["verification_status"] == "verified",
                "hand_labeled_fields": r["hand_labeled_fields"],
            }
            for r in golden["reports"]
        ],
        "signals": [
            {
                "id": s["id"],
                "manufacturer": s["manufacturer"],
                "symptom": s["symptom"],
                "rank": signals.index(s) + 1,
                "case_count": s["case_count"],
                "prr": s["prr"],
                "ror": s["ror"],
                "ci_lower": s["ci_lower"],
                "ci_upper": s["ci_upper"],
                "chi_square": s["chi_square"],
                "reports": wanted[(s["manufacturer"], s["symptom"])],
            }
            for s in chosen
        ],
    }
    os.makedirs("data", exist_ok=True)
    with open("data/eval-inputs.json", "w", encoding="utf-8") as f:
        json.dump(out, f, indent=1)
    short = [s for s in out["signals"] if len(s["reports"]) < REPORTS_PER_SIGNAL]
    for s in short:
        print(f'#{s["rank"]:>3} {s["manufacturer"]:<16} {s["symptom"]:<28} only {len(s["reports"])} reports')
    print(f'signals: {len(out["signals"])}, reports: {sum(len(s["reports"]) for s in out["signals"])}')
    print(f'golden: {len(out["golden"])} reports, {sum(g["verified"] for g in out["golden"])} verified')


if __name__ == "__main__":
    main()

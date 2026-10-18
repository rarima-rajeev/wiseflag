import { Wand2, UserCheck, GraduationCap } from "lucide-react";
import answerKey from "@/data/answer-key.json";

const STEPS = [
  {
    icon: Wand2,
    title: "Simple rules pre-fill",
    text: "Basic text matching suggests age, sex, symptoms, timing and outcome, and points to the exact words it used.",
  },
  {
    icon: UserCheck,
    title: "A person confirms each field",
    text: "Every field is checked against the report one by one, so nothing gets approved in bulk.",
  },
  {
    icon: GraduationCap,
    title: "The AI gets graded",
    text: "Each model reads the same 20 reports. Its answers are compared with the key, field by field.",
  },
];

const FIELDS = [
  { name: "Age", hint: "only if the report says it" },
  { name: "Sex", hint: "Female, Male, or not reported" },
  { name: "Symptoms", hint: "only the ones described" },
  { name: "Timing", hint: "how soon after the shot" },
  { name: "Outcome", hint: "recovered, hospitalized, died, unknown" },
];

export default function HowTheKeyIsMade() {
  const pctDone = Math.round((answerKey.fieldsConfirmed / answerKey.fieldsTotal) * 100);

  return (
    <section className="w-full text-left space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">How the answer key is made</h2>
        <ol className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.title} className="relative bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold text-slate-400">STEP {i + 1}</span>
                </div>
                <p className="font-bold text-sm text-slate-900 mt-3">{s.title}</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">{s.text}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <p className="text-sm font-bold text-slate-900">The 5 things checked in every report</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {FIELDS.map((f) => (
            <span key={f.name} className="inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-800">{f.name}</span>
              <span className="text-slate-500">{f.hint}</span>
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          The golden rule: if a report doesn&apos;t say it, the right answer is &quot;not reported.&quot; Guessing counts as wrong.
        </p>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span className="font-semibold">Hand-labeling progress</span>
            <span className="tabular-nums">
              {answerKey.fieldsConfirmed} of {answerKey.fieldsTotal} fields confirmed
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(pctDone, 0)}%` }} />
          </div>
          {answerKey.fieldsConfirmed === 0 ? (
            <p className="text-xs text-slate-500 mt-1.5">Rules have pre-filled every field. Human confirmation is next.</p>
          ) : (
            <p className="text-xs text-slate-500 mt-1.5">
              Every field was checked against the report by a person. {answerKey.fieldsCorrected} of the rules&apos; draft
              values were wrong and corrected, such as &quot;Syncope&quot; (fainting) for a report that only describes
              near-fainting.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

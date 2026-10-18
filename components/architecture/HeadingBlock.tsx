import { HEADING } from "@/config/architecture";

export default function HeadingBlock() {
  return (
    <div className="w-full text-center max-w-4xl mx-auto pt-2 pb-6">
      <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-2">
        {HEADING.termLabel}
      </p>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
        {HEADING.title}
      </h1>

      <p className="mt-3 text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-snug">
        {HEADING.plainSummary}
      </p>

      {/* Three-role strip */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
        {HEADING.roles.map((role) => (
          <div
            key={role.title}
            className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs text-center"
          >
            <p className="text-sm font-bold text-slate-900">{role.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{role.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

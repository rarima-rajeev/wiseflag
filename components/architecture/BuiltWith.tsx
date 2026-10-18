import { BUILT_WITH } from "@/config/architecture";

export default function BuiltWith() {
  return (
    <section aria-label="Technology stack" className="w-full py-2">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">
          Built with:
        </span>
        {BUILT_WITH.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-medium shadow-xs"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { UserCheck } from "lucide-react";

// Hand-off from statistics to the human step: points visitors at the reviewer exercise.
export default function ReviewerTeaser() {
  return (
    <Link
      href="/human-review"
      className="group w-full flex flex-col sm:flex-row sm:items-center gap-4 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl shadow-sm p-5 sm:p-6 text-left hover:shadow-md hover:-translate-y-0.5 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
    >
      <span className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
        <UserCheck className="w-6 h-6" aria-hidden="true" />
      </span>
      <span className="flex-1">
        <span className="block text-base sm:text-lg font-bold tracking-tight">A flag is only the start. You be the reviewer.</span>
        <span className="block text-sm text-indigo-100 mt-1">
          Check an AI summary of real Guillain-Barré reports and decide: approve, edit or reject.
        </span>
      </span>
      <span className="text-sm font-semibold inline-flex items-center gap-1 shrink-0">
        Try it
        <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

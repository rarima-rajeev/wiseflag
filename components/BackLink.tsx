import Link from "next/link";

export default function BackLink() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-2">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 rounded-md py-0.5"
      >
        <span aria-hidden="true">←</span>
        <span>Back to overview</span>
      </Link>
    </div>
  );
}

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import SubPageLayout from "@/components/SubPageLayout";

export default function NotFound() {
  return (
    <SubPageLayout currentRoute="">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-5">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </div>

          <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-2">
            404 Error
          </p>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>

          <p className="mt-3 text-base text-slate-500">
            The page you requested could not be found.
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl shadow-sm transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <span aria-hidden="true">←</span>
              <span>Back to overview</span>
            </Link>
          </div>
        </div>
      </main>
    </SubPageLayout>
  );
}

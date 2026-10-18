import { AlertTriangle } from "lucide-react";

export default function DisclaimerStrip() {
  return (
    <aside
      aria-label="Disclaimer"
      className="w-full bg-[#E89F3C] text-[#451A03] px-4 py-2.5 text-xs sm:text-sm font-medium border-b border-[#D48B28]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2">
        <AlertTriangle
          className="w-4 h-4 shrink-0 text-[#451A03]"
          aria-hidden="true"
        />
        <span>
          Demo only. Not for clinical or public-health decisions. VAERS reports are unverified and do not establish causation.
        </span>
      </div>
    </aside>
  );
}

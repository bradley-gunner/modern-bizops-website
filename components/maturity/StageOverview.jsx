import { STAGES } from "@/lib/maturity/stages";
import { competenciesForStage } from "@/lib/maturity/competencies";

// One icon per stage, keyed by stage number. Inline SVG, self-contained.
const STAGE_ICON = {
  1: (
    <>
      <path d="M12 3v18M5 8l7-5 7 5" />
      <circle cx="12" cy="15" r="3" />
    </>
  ),
  2: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 4v16" />
    </>
  ),
  3: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-5 3 3 4-6" />
    </>
  ),
  4: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M17 7l2-2M5 19l2-2" />
    </>
  ),
};

export default function StageOverview() {
  return (
    <div id="the-four-stages" className="relative scroll-mt-24">
      {/* Progression line behind the nodes (desktop only). */}
      <div className="hidden lg:block absolute left-[12%] right-[12%] top-[52px] h-0.5 bg-gradient-to-r from-border via-amber-light to-green" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((s) => (
          <div
            key={s.n}
            className={`relative bg-white border rounded-2xl p-6 text-center ${
              s.n === 3 ? "border-amber shadow-[0_10px_30px_rgba(200,93,10,0.10)]" : "border-border"
            }`}
          >
            <span className="relative z-10 mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cream border-2 border-amber text-amber">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {STAGE_ICON[s.n]}
              </svg>
            </span>
            <div className="text-[11px] tracking-widest uppercase text-text-light">
              Stage {String(s.n).padStart(2, "0")}
            </div>
            <div className="font-display font-semibold text-navy text-2xl">
              {s.name}
            </div>
            <div className="text-[11px] tracking-widest uppercase text-amber-light font-semibold">
              {s.tag}
            </div>
            <div className="mt-3 text-xs text-amber font-semibold">
              {competenciesForStage(s.n).length} competencies
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

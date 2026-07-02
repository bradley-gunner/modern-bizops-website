import { STAGES } from "@/lib/maturity/stages";
import { competenciesForStage } from "@/lib/maturity/competencies";

export default function StageOverview() {
  return (
    <div
      id="the-four-stages"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 scroll-mt-24"
    >
      {STAGES.map((s) => (
        <div
          key={s.n}
          className="bg-white border border-border rounded-2xl p-5"
        >
          <div className="font-display font-bold text-amber text-2xl">
            {String(s.n).padStart(2, "0")}
          </div>
          <div className="font-display font-semibold text-navy text-2xl">
            {s.name}
          </div>
          <div className="text-[11px] tracking-widest uppercase text-text-light mb-2">
            {s.tag}
          </div>
          <p className="text-sm text-text-mid leading-snug">{s.def}</p>
          <div className="mt-3 text-xs text-amber font-semibold">
            {competenciesForStage(s.n).length} competencies
          </div>
        </div>
      ))}
    </div>
  );
}

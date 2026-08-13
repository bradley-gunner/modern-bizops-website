import VizBlock from "@/components/learn/VizBlock";

// The four named stages of the GTM Maturity Framework, rendered as
// semantic HTML rather than an image. A fill that rises 25% per stage encodes
// the claim the AI cluster shares: AI usefulness climbs with maturity. Every
// stage name and note is a real text node, so the strip stays crawlable.
//
// `highlightFrom` (1-based) tints the stages at and above it amber, marking where
// the automation actually pays off. `footnote` accepts a node so a page can hang
// a /scorecard link off the strip.
const STAGES = ["Reactive", "Repeatable", "Predictable", "Compounding"];

export default function MaturityStrip({
  label = "The four stages",
  title,
  notes = [],
  highlightFrom,
  footnote,
}) {
  return (
    <VizBlock label={label} title={title}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        {STAGES.map((name, i) => {
          const highlighted = highlightFrom != null && i + 1 >= highlightFrom;
          const barColor = highlighted ? "#E8873A" : "#2468A8";
          return (
            <div
              key={name}
              className={`rounded-[12px] border px-4 py-4 ${
                highlighted
                  ? "border-amber/40 bg-amber/[0.08]"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="mb-2.5 flex items-center gap-2">
                <span className="font-display text-[13px] font-bold text-text-light">
                  0{i + 1}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-1.5 rounded-full"
                    style={{ width: `${25 * (i + 1)}%`, background: barColor }}
                  />
                </span>
              </div>
              <p
                className={`font-display text-[17px] font-semibold ${
                  highlighted ? "text-amber-light" : "text-white"
                }`}
              >
                {name}
              </p>
              {notes[i] && (
                <p className="mt-1.5 text-[13.5px] leading-[1.5] text-[#DCE3EE]">
                  {notes[i]}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {footnote && (
        <p className="mt-4 text-[13.5px] leading-[1.5] text-text-light">
          {footnote}
        </p>
      )}
    </VizBlock>
  );
}

import VizBlock from "@/components/learn/VizBlock";

// Red -> green heat ramp: level 1 must read bad, level 5 must read good.
// Indexed by the rung's own `level` so a page cannot silently mis-colour a rung
// by listing its rubric out of order.
const RAMP = {
  1: "var(--color-l1)",
  2: "var(--color-l2)",
  3: "var(--color-l3)",
  4: "var(--color-l4)",
  5: "var(--color-l5)",
};

// Levels 1-4 match LEVEL_WORDS in lib/scorecard/voice.js, the same vocabulary
// the AI Revenue Scan reports back. The /learn rubric runs one rung
// further than the Scan's 1-4, so Optimized is defined here. Shared rather
// than passed per page: the tag is a property of the level, not of the page.
export const LADDER_TAGS = {
  1: "Absent",
  2: "Informal",
  3: "Functional",
  4: "Managed",
  5: "Optimized",
};

// The signature /learn visual: a page's Level 1-5 rubric rendered as semantic
// HTML rather than an image. Same words as the prose it replaces, better
// scanning and better AI extraction.
//
// The level column is fixed at 76px and the tag sits at 9.5px/nowrap so the
// longest tags ("Functional", "Optimized") never clip. Descriptions reflow; the
// rung always stays full width.
export default function MaturityLadder({ label, title, rungs }) {
  return (
    <VizBlock label={label} title={title}>
      <div className="flex flex-col gap-2">
        {rungs.map((rung) => {
          const color = RAMP[rung.level] ?? "#888";
          return (
            <div
              key={rung.level}
              className="flex items-start gap-4 rounded-[11px] border-l-[6px] bg-white/[0.04] px-4 py-4 md:gap-[22px] md:px-[22px]"
              style={{ borderLeftColor: color }}
            >
              <div className="w-[76px] flex-none text-center leading-none">
                <span
                  className="block font-display text-[34px] font-bold"
                  style={{ color }}
                >
                  {rung.level}
                </span>
                <span className="mt-[5px] block whitespace-nowrap text-[9.5px] font-medium uppercase tracking-[0.06em] text-text-light">
                  {rung.tag ?? LADDER_TAGS[rung.level]}
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-[3px] text-[15px] leading-[1.5] text-[#E7ECF3] [&_b]:text-white [&_strong]:text-white">
                {rung.desc}
              </div>
            </div>
          );
        })}
      </div>
    </VizBlock>
  );
}

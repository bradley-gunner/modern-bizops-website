import VizBlock from "@/components/learn/VizBlock";

// Two-column contrast for the retention cluster: the market's default on the
// left, the B2B system on the right. Each column is a real <ul> of
// DOM text nodes (never an image), condensed from the page's own prose, so the
// distinction stays crawlable and AI-extractable. Navy like every data block;
// the right column is picked out in amber because it is the model the page
// teaches. Columns sit side by side on desktop and stack on mobile.
export default function ContrastColumns({
  label,
  title,
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
}) {
  return (
    <VizBlock label={label} title={title}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-[14px] border border-white/10 bg-white/[0.045] px-6 py-6">
          <p className="mb-4 font-display text-[17px] font-semibold text-white">
            {leftTitle}
          </p>
          <ul className="flex flex-col gap-2.5">
            {leftItems.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-[15px] leading-[1.5] text-[#DCE3EE]"
              >
                <span aria-hidden="true" className="mt-[3px] text-text-light">
                  &bull;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[14px] border border-amber/30 bg-amber/[0.07] px-6 py-6">
          <p className="mb-4 font-display text-[17px] font-semibold text-amber-light">
            {rightTitle}
          </p>
          <ul className="flex flex-col gap-2.5">
            {rightItems.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-[15px] leading-[1.5] text-[#F4E8DA]"
              >
                <span aria-hidden="true" className="mt-[3px] text-amber-light">
                  &bull;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </VizBlock>
  );
}

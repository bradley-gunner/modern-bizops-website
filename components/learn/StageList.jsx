import VizBlock from "@/components/learn/VizBlock";

// A numbered vertical sequence (lifecycle stages, funnel conversion rates)
// rendered as a semantic ordered list inside the navy data block. Every stage
// name and description is a real DOM text node condensed from the page's own
// prose, never an image, so the structure stays crawlable and AI-extractable.
export default function StageList({ label, title, stages }) {
  return (
    <VizBlock label={label} title={title}>
      <ol className="flex flex-col gap-3">
        {stages.map((stage, i) => (
          <li
            key={stage.name}
            className="flex gap-4 rounded-[14px] border border-white/10 bg-white/[0.045] px-5 py-4"
          >
            <span className="font-display text-[26px] font-bold leading-none text-amber-light">
              {i + 1}
            </span>
            <div>
              <p className="mb-1 font-display text-[17px] font-semibold text-white">
                {stage.name}
              </p>
              <p className="text-[14px] leading-[1.5] text-[#DCE3EE]">
                {stage.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </VizBlock>
  );
}

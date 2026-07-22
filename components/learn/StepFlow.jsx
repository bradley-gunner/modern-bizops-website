import VizBlock from "@/components/learn/VizBlock";

// A short, numbered "do this now" sequence rendered as a semantic ordered list
// inside the navy data block. Every step title and description is a real DOM
// text node pulled from the page's own prose, never an image, so the move stays
// crawlable and extractable. Used by the 4.1 "one move you can run this week"
// section (export deals, ask the assistant, read the pattern).
export default function StepFlow({ label, title, steps }) {
  return (
    <VizBlock label={label} title={title}>
      <ol className="flex flex-col gap-4 md:flex-row">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="flex-1 rounded-[14px] border border-white/10 bg-white/[0.045] px-5 py-5"
          >
            <span className="mb-2 block font-display text-[32px] font-bold leading-none text-amber-light">
              {i + 1}
            </span>
            <p className="mb-1.5 font-display text-[17px] font-semibold text-white">
              {step.title}
            </p>
            <p className="text-[14px] leading-[1.5] text-[#DCE3EE]">{step.desc}</p>
          </li>
        ))}
      </ol>
    </VizBlock>
  );
}

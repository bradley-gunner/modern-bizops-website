import Section from "../ui/Section";

export default function CostOfInaction() {
  return (
    <Section bg="cream">
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-8">
        Every Month You Wait, It Gets Harder
      </h2>
      <div className="space-y-6 font-body text-text-primary text-base md:text-lg leading-relaxed">
        <p>
          Leads that should convert don&apos;t. Clients that should stay leave.
          Team members that should be producing revenue are drowning in manual
          tasks and miscommunication.
        </p>
        <p>
          AI is transforming how companies sell, market, and serve customers
          right now. Every month you wait, your competitors adopt it first.
        </p>
        <p>
          Meanwhile, headcount keeps creeping up, margins keep shrinking, and
          your business becomes less valuable — not more.
        </p>
        <p>
          The cost of inaction isn&apos;t just lost revenue. It&apos;s the
          compounding cost of a business that gets harder to run, harder to sell,
          and harder to enjoy every year you don&apos;t fix the engine.
        </p>
      </div>
    </Section>
  );
}

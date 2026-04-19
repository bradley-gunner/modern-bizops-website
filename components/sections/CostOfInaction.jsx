import Section from "../ui/Section";

export default function CostOfInaction() {
  return (
    <Section bg="cream">
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-8">
        Every Month You Wait, It Gets Harder
      </h2>
      <div className="space-y-5 font-body text-text-primary text-base md:text-lg leading-relaxed">
        <p>
          Leads that should convert don&apos;t. Clients that should stay leave.
          Your team is buried in manual work when they should be producing
          revenue. AI is reshaping how companies sell and serve customers right
          now, and every month you wait, your competitors who move first get
          further ahead.
        </p>
        <p>
          Meanwhile, headcount keeps creeping up, margins keep shrinking, and
          your business becomes harder to run, harder to sell, and harder to
          enjoy.
        </p>
      </div>

      <div className="mt-8 bg-navy rounded-[14px] p-6 md:p-8 text-center">
        <p className="font-display text-xl md:text-2xl font-semibold text-white leading-snug">
          The cost of inaction isn&apos;t just lost revenue. It compounds.
        </p>
      </div>
    </Section>
  );
}

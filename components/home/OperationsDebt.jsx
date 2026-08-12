import Section from "../ui/Section";

// Section 3: the problem, in the burned-buyer register. The best informed
// buyers in this market have been burned once and can smell vibes-based
// selling, so this names the failure modes before the prospect has to.
//
// This is the operations-debt pillar, which is the message the whole offer
// hangs on: the debt was priced against inconvenience, and AI repriced it
// against capability. The audit is its commercial expression.
const FAILURE_MODES = [
  {
    title: "The data was wrong",
    body: "So the automation was wrong too, only faster and with more confidence than the person it replaced.",
  },
  {
    title: "The process lived in someone's head",
    body: "There was nothing written down to automate, so the pilot automated a guess about how the work gets done.",
  },
  {
    title: "Nobody owned it after launch",
    body: "It ran for a month, then stopped firing. No one noticed until a number looked wrong.",
  },
];

export default function OperationsDebt() {
  return (
    <Section bg="white" narrow={false}>
      <div className="max-w-[760px]">
        <p className="font-body text-[13px] font-medium uppercase tracking-[0.26em] text-amber mb-4">
          Operations debt, repriced
        </p>
        <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
          You probably tried this once already.
        </h2>
        <div className="space-y-5 font-body text-text-mid text-base md:text-lg leading-relaxed">
          <p>
            You bought the tool. You read the case studies. You ran the pilot.
            And it died quietly on a foundation nobody checked.
          </p>
          <p>
            The tool was probably fine. Dirty data, duct-tape process, fields
            nobody fills in. The debt you could tolerate for years was priced
            against inconvenience, and AI repriced it against capability. The
            cleanup you kept meaning to get to is now the thing that decides
            whether any of this works for you at all.
          </p>
          <p className="text-navy font-medium">
            So we fix the foundation first, and build the automation on top of
            it. One named system at a time, at a published price.
          </p>
        </div>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FAILURE_MODES.map((mode) => (
          <div key={mode.title} className="bg-cream rounded-[14px] p-6">
            <p className="font-body font-semibold text-navy text-base mb-2">
              {mode.title}
            </p>
            <p className="font-body text-text-mid text-[15px] leading-relaxed">
              {mode.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

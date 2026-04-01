import Section from "../ui/Section";

const steps = [
  {
    number: "1",
    title: "Diagnose",
    description:
      "Book a discovery call. We'll connect our diagnostic app to your tools, analyze your data, and show you exactly where your revenue engine is leaking — with numbers, not opinions.",
  },
  {
    number: "2",
    title: "Build",
    description:
      "Over 4–12 weeks, we work through a custom 7-phase roadmap together. Your leadership team builds the systems with my guidance, implementing everything from sales process architecture to AI automation.",
  },
  {
    number: "3",
    title: "Own",
    description:
      "When we're done, your team has the skills, the systems, and the dashboards to run the engine independently. No long-term retainer. No dependency. Just a more valuable business.",
  },
];

export default function HowItWorks() {
  return (
    <Section bg="cream" id="how-it-works" narrow={false}>
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-12 text-center">
        Three Steps to a Revenue Engine That Runs Without You
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="w-14 h-14 rounded-full bg-navy text-white font-display text-2xl font-semibold flex items-center justify-center mx-auto mb-5">
              {step.number}
            </div>
            <h3 className="font-display text-2xl font-semibold text-navy mb-3">
              {step.title}
            </h3>
            <p className="font-body text-text-mid leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

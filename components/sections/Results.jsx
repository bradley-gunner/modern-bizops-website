import Image from "next/image";
import Section from "../ui/Section";
import Card from "../ui/Card";

const results = [
  {
    stat: "47 → 23 days",
    metric: "Sales Cycle Cut in Half",
    description:
      "Reduced from 3 to 4 discovery calls down to 1.5. A $12M services company reached this in 8 weeks after rebuilding the sales process.",
  },
  {
    stat: "18% → 34%",
    metric: "Conversion Rate Doubled",
    description:
      "Close rates jumped after rebuilding the sales process around buyer actions, not gut feelings.",
  },
  {
    stat: "$1M+ ARR",
    metric: "Saved in Churned Revenue",
    description:
      "90-day churn reduced by 50% over 6 quarters. Structured onboarding and client lifecycle playbooks protected over $1M in recurring revenue.",
  },
  {
    stat: "+31% revenue",
    metric: "Zero New Hires",
    description:
      "Revenue grew 31% in one quarter with the same team. The difference was not people. It was systems.",
  },
];

export default function Results() {
  return (
    <Section bg="white" id="results" narrow={false}>
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-12 text-center">
        What Changes Look Like
      </h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
        {results.map((result) => (
          <Card key={result.metric}>
            <p className="font-display text-2xl md:text-[28px] font-semibold text-amber mb-1">
              {result.stat}
            </p>
            <p className="font-display text-lg font-semibold text-navy mb-3">
              {result.metric}
            </p>
            <p className="font-body text-text-mid leading-relaxed">
              {result.description}
            </p>
          </Card>
        ))}
      </div>

      {/* Scorecard comparison visual */}
      <div className="mt-12 max-w-[900px] mx-auto">
        <p className="font-body text-sm text-text-mid text-center mb-4 font-medium">
          Before and after — the platform tracks every dimension in real time
        </p>
        <div className="rounded-xl overflow-hidden border border-border shadow-md">
          <div className="bg-navy px-3 py-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" aria-hidden="true" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" aria-hidden="true" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" aria-hidden="true" />
            <div className="flex-1 mx-2 bg-white/10 rounded h-4 flex items-center px-2">
              <span className="text-[9px] text-white/40 font-mono">app.modernbizops.com</span>
            </div>
          </div>
          <Image
            src="/images/app/scorecard-comparison.png"
            alt="Scorecard comparison showing baseline score of 57 vs current score of 79, a 22-point gain"
            width={900}
            height={600}
            className="w-full block"
          />
        </div>
      </div>
    </Section>
  );
}

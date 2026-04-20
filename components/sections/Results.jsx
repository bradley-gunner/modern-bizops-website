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
    </Section>
  );
}

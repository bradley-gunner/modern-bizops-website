import Section from "../ui/Section";
import Card from "../ui/Card";

const results = [
  {
    metric: "Sales Cycle Cut in Half",
    description:
      "A $12M services company went from 47-day average sales cycles to 23 days in 8 weeks.",
  },
  {
    metric: "Conversion Rate Doubled",
    description:
      "Close rates jumped from 18% to 34% after rebuilding the sales process around buyer actions, not gut feelings.",
  },
  {
    metric: "$1M in Churn Saved",
    description:
      "Structured onboarding and client lifecycle playbooks reduced annual churn by 40% — protecting over $1M in recurring revenue.",
  },
  {
    metric: "Zero New Hires",
    description:
      "Revenue grew 31% in one quarter with the same team. The difference wasn't people — it was systems.",
  },
];

export default function Results() {
  return (
    <Section bg="cream" id="results" narrow={false}>
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-12 text-center">
        What Changes Look Like
      </h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
        {results.map((result) => (
          <Card key={result.metric}>
            <p className="font-display text-2xl md:text-[28px] font-semibold text-navy mb-3">
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

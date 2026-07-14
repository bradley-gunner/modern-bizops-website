import Section from "../ui/Section";
import Card from "../ui/Card";

const results = [
  {
    stat: "2x",
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

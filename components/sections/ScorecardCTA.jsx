import Section from "../ui/Section";
import Button from "../ui/Button";

export default function ScorecardCTA() {
  return (
    <Section bg="cream">
      <div className="text-center max-w-[560px] mx-auto">
        <p className="font-body text-sm font-semibold text-amber uppercase tracking-widest mb-4">
          Free Tool
        </p>
        <h2 className="font-display text-[28px] md:text-[34px] font-semibold text-navy mb-4">
          Not Ready for a Call Yet?
        </h2>
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed mb-8">
          Get your free Revenue Engine Health Score. Answer 17 questions and
          see exactly where your growth is leaking. Instant results. No call
          required.
        </p>
        <Button href="/scorecard" size="large" variant="secondary">
          Get My Free Score
        </Button>
      </div>
    </Section>
  );
}

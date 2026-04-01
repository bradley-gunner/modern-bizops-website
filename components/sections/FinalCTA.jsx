import Section from "../ui/Section";
import Button from "../ui/Button";

export default function FinalCTA() {
  return (
    <Section bg="cream" className="text-center">
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-6">
        Ready to Build a Revenue Engine That Doesn&apos;t Need More People?
      </h2>
      <p className="font-body text-text-mid text-lg leading-relaxed mb-8 max-w-[600px] mx-auto">
        Book a free 45-minute discovery call. We&apos;ll look at your current
        revenue engine, identify the biggest friction points, and determine
        whether this is the right fit. No pitch. Just a real conversation.
      </p>
      <Button href="/book" size="large">
        Book Your Discovery Call
      </Button>
      <p className="font-body text-sm text-text-mid mt-4">
        Typically responds within 24 hours.
      </p>
    </Section>
  );
}

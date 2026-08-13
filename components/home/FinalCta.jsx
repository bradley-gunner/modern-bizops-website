import Section from "../ui/Section";
import Button from "../ui/Button";

// Section 9: restate the hero and close.
//
// The secondary line is only possible because the prices are published: when a
// buyer already knows the numbers, the call stops being a price negotiation
// and becomes a fit check, which is a much smaller thing to agree to.
export default function FinalCta() {
  return (
    <Section bg="navy" narrow={false} className="text-center">
      <div className="max-w-[760px] mx-auto">
        <h2 className="font-display text-[32px] md:text-[40px] font-semibold text-white leading-[1.12] mb-6">
          More leads, more booked calls, more closed deals, and a team with less
          busywork.
        </h2>
        <p className="font-body text-white/80 text-base md:text-lg leading-relaxed mb-9">
          Start with the free Scan. Fifteen questions, about five minutes, and
          no call required.
        </p>
        <Button href="/scorecard" size="large" ctaLocation="home_closing">
          Get the Free Scan
        </Button>
        <p className="font-body text-white/70 text-base leading-relaxed mt-10 mb-5">
          Ready to talk instead? The call confirms your fit and your price.
        </p>
        <Button href="/book" variant="secondary" ctaLocation="home_closing">
          Book a call
        </Button>
      </div>
    </Section>
  );
}

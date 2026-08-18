import CtaCallout from "../learn/CtaCallout";
import Button from "../ui/Button";

// Section 9: restate the hero and close.
//
// The secondary line is only possible because the prices are published: when a
// buyer already knows the numbers, the call stops being a price negotiation
// and becomes a fit check, which is a much smaller thing to agree to.
//
// The card is load-bearing, not decoration. This was a full-bleed navy Section
// sitting directly on the navy footer, so the close and the sitemap read as one
// continuous field and the last thing the page says had no edge. Every other
// closing CTA on the site is a navy card on a light band; this one now matches.
export default function FinalCta() {
  return (
    <div className="bg-white px-6 py-6 md:px-8 md:py-10">
      <CtaCallout>
        <h2 className="font-display text-[32px] md:text-[40px] font-semibold text-white leading-[1.12] mb-6">
          More leads, more booked calls, more closed deals, and a team with less
          busywork.
        </h2>
        <p className="font-body text-white/80 text-base md:text-lg leading-relaxed mb-9">
          Start with the free Scan. Sixteen questions, about five minutes, and
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
      </CtaCallout>
    </div>
  );
}

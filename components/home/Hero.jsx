import Link from "next/link";
import Button from "../ui/Button";

// Section 1 of the modal homepage anatomy: category, audience, outcome, in
// plain words, and one CTA. The 10-second test is the whole job here (Hinge:
// buyers rule out roughly half of firms from the site alone), so the H1 is the
// approved one-sentence positioning line verbatim and nothing competes with it.
//
// No image in this section on purpose. Bradley's face is the proof asset, and
// it earns more in the founder section further down than it does fighting the
// H1 for the first two seconds. Putting it in both places reads as stock.
//
// One primary CTA site-wide is the Scan. "See pricing" is a text link, not a
// second button, on purpose: two buttons of equal weight is two primary CTAs.
// The trade is that a plain Link fires no cta_click, because Button is what
// carries the analytics. Accepted here, and still true: "/pricing" is now in
// CTA_DESTINATIONS (components/ui/Button.jsx), so a Button pointing there does
// track, but this link is deliberately not one and still reports nothing.
export default function Hero() {
  return (
    <section className="bg-cream py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="max-w-[880px]">
          <h1 className="font-display text-[36px] md:text-[46px] lg:text-[58px] font-semibold leading-[1.08] text-navy mb-6">
            More leads, more booked calls, more closed deals, and a team with
            less busywork.
          </h1>
          <p className="font-body text-[17px] md:text-lg lg:text-xl text-text-mid leading-relaxed mb-9 max-w-[640px]">
            The AI automation partner for B2B go-to-market. Foundation first,
            published fixed prices, your team owns everything we build.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Button href="/scorecard" size="large" ctaLocation="home_hero">
              Get the Free Scan
            </Button>
            <Link
              href="/pricing"
              className="font-body text-base text-navy-mid underline underline-offset-4 hover:text-navy transition-colors"
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

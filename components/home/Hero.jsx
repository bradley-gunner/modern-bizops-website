import Link from "next/link";
import Button from "../ui/Button";
import { AUDIENCE_BAND } from "@/lib/offers";

// Section 1 of the modal homepage anatomy: category, audience, outcome, in
// plain words, and one CTA. The 10-second test is the whole job here (Hinge:
// buyers rule out roughly half of firms from the site alone).
//
// The H1 was the approved positioning line verbatim, which led with the
// outcome ("More leads, more booked calls...") and left the reader to infer
// the category. Bradley's call on 2026-08-18: say what we do first, in the
// most literal words available, so nobody has to work it out. The outcome is
// still in the sentence, after the verb rather than in place of it. NOTE
// this means the H1 no longer matches doc 08's positioning line word for word.
//
// No image in this section on purpose. Bradley's face is the proof asset, and
// it earns more in the founder section further down than it does fighting the
// H1 for the first two seconds. Putting it in both places reads as stock.
//
// One primary CTA site-wide is the Scan. "See every price" is a text link, not
// a second button, on purpose: two buttons of equal weight is two primary CTAs.
// The trade is that a plain Link fires no cta_click, because Button is what
// carries the analytics, and this link is deliberately not a Button.
//
// 2026-09-01, the subhead. It read "Fixing foundational systems first.
// Transparent pricing. Never manufacturing unnecessary lock-in." Three
// fragments of near-identical length with the third reaching for grandeur is
// the single most recognizable machine-written cadence there is, and the same
// shape was running in two other heroes on the site. It is now two sentences of
// different lengths that say the same three things.
//
// It also carries the revenue band, which is board item web-audience-legibility.
// David Ellis (Tugboat) read the whole site for an hour and came away thinking
// we serve $10M+ companies, which made Motion A of ICP v2 ($1-10M, the free
// Scan and the $2,500 audit) invisible. The band is now in the first thing a
// visitor reads after the H1.
export default function Hero() {
  return (
    <section className="bg-cream py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="max-w-[880px]">
          <h1 className="font-display text-[36px] md:text-[46px] lg:text-[58px] font-semibold leading-[1.08] text-navy mb-6">
            We implement AI automation that generates more leads, more sales,
            and less busywork for your B2B business
          </h1>
          <p className="font-body text-[17px] md:text-lg lg:text-xl text-text-mid leading-relaxed mb-9 max-w-[640px]">
            For {AUDIENCE_BAND.sentence}. We fix the foundation the automation
            has to stand on, and every price we charge is published before you
            talk to anyone.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Button href="/scorecard" size="large" ctaLocation="home_hero">
              Get the Free Scan
            </Button>
            <Link
              href="/ai-automation-services"
              className="font-body text-base text-navy-mid underline underline-offset-4 hover:text-navy transition-colors"
            >
              See every price
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

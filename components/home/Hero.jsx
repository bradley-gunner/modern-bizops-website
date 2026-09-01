import Link from "next/link";
import Button from "../ui/Button";
import VSSLPlayer from "../VSSLPlayer";
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
// THE VIDEO LEADS THE PAGE, AS OF 2026-09-01. Board item web-personality-design,
// David Ellis (Tugboat) slides 11 and 22, his joint highest-rated finding: he
// would have assumed this was a minimally-tweaked Squarespace or Wix site if he
// had not already known otherwise. The homepage opened on text alone, on cream,
// with nothing to look at above the fold.
//
// THIS DOES NOT REVERSE THE OLD "no image in this section" RULE, it satisfies
// its actual argument. That rule said Bradley's face earns more in the founder
// section than fighting the H1, and that using the same headshot twice reads as
// stock. Both still hold: the headshot stays in the founder section and appears
// nowhere else. What sits here is a different asset doing a different job, the
// VSL poster, which is a video still carrying its own claim in Cormorant over
// navy with the amber rule. It is also the only piece of art on this site that
// nobody else could own, because it is his face and his sentence.
//
// It MOVED here rather than being added: the same player used to sit mid-page
// inside Mechanism, so the homepage now shows it once rather than twice.
//
// One primary CTA site-wide is the Scan. "See every price" is a text link, not
// a second button, on purpose: two buttons of equal weight is two primary CTAs.
// The trade is that a plain Link fires no cta_click, because Button is what
// carries the analytics, and this link is deliberately not a Button.
//
// The subhead read "Fixing foundational systems first. Transparent pricing.
// Never manufacturing unnecessary lock-in." Three fragments of near-identical
// length with the third reaching for grandeur is the single most recognizable
// machine-written cadence there is, and the same shape was running in two other
// heroes on the site. It is now two sentences of different lengths.
//
// It also carries the revenue band, which is board item web-audience-legibility.
export default function Hero() {
  return (
    <section className="bg-cream py-14 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
          <div className="max-w-[640px]">
            <h1 className="font-display text-[36px] md:text-[46px] lg:text-[54px] font-semibold leading-[1.08] text-navy mb-6">
              We implement AI automation that generates more leads, more sales,
              and less busywork for your B2B business
            </h1>
            <p className="font-body text-[17px] md:text-lg text-text-mid leading-relaxed mb-8 max-w-[560px]">
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

          {/* ctaLocation stays home_hero rather than becoming a new value, so
              the GA4 split for this position does not fork when the player
              moves. The mid-page value home_mid_page retires with the block it
              named; a filter written against it will now return nothing, which
              is correct rather than broken. */}
          <div className="lg:justify-self-end w-full">
            <VSSLPlayer ctaLocation="home_hero" className="mb-0" />
            <p className="mt-4 font-body text-[15px] text-text-light leading-relaxed">
              Bradley, on why the foundation is the whole job. Fourteen minutes,
              and there is no form in front of it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

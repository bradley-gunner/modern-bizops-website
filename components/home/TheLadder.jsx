import Link from "next/link";
import Section from "../ui/Section";
import { LADDER } from "@/lib/offers";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

// Section 5: the process IS the ladder. On 8 of the 12 sites torn down for doc
// 14 the process section exists to walk a buyer to a paid diagnostic, and the
// market has converged on exactly the ladder already signed here. So this shows
// the real thing rather than a generic four-step "discovery, strategy,
// execution, results" band.
//
// Every rung carries its price, including the free one. Both the price and the
// sentence come from lib/offers.js so the homepage can never disagree with the
// Pricing page. Nothing here is a hardcoded number.
//
// Four cards, five rungs: Partner and Partner Plus are one decision with two
// sizes, so they share the last card. The split is worked through on
// /ai-automation-services, where a buyer is actually choosing between them.
//
// The second price rides along with the NAME that carries it. It used to sit in
// the Partner card's price line as "$2,500 a month or $8,000 a month", which
// put two prices under one product name while the services page sold the
// second one as a separately named rung. Nothing on this page states a rung
// total any more either, because the page shows four cards and the services
// page lists five.
//
// 2026-08-12: four priced rungs is a sequence, and it rendered as four
// identical text cards, so nothing on screen said "ladder" except the heading.
// Three things fix that without touching a word: a four-segment meter that
// fills one more notch per card, a staircase offset at lg so the row climbs
// left to right, and the free first rung tinted so the entry point is visible
// before anyone reads a price. The offsets are written out as literal class
// strings because Tailwind reads the source, not the runtime value.
const RUNGS = [
  { id: "scan", offset: "lg:mt-12" },
  { id: "audit", offset: "lg:mt-8" },
  { id: "builds", offset: "lg:mt-4" },
  { id: "partner", also: "partner-plus", offset: "lg:mt-0" },
];

export default function TheLadder() {
  return (
    <Section bg="white" narrow={false} id="how-it-works">
      <div className="max-w-[760px] mb-10">
        <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
          Nothing here requires the next thing.
        </h2>
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
          You can stop at any rung and keep everything built up to it. The first
          one is free and you can do it right now, without talking to anyone.
        </p>
      </div>

      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:items-start">
        {RUNGS.map((step, i) => {
          const offer = rung[step.id];
          const also = step.also ? rung[step.also] : null;
          return (
            <li
              key={step.id}
              className={`${step.offset} ${
                i === 0 ? "bg-amber-pale" : "bg-cream"
              } rounded-[14px] p-6 flex flex-col`}
            >
              <span aria-hidden="true" className="flex gap-1.5 mb-5">
                {RUNGS.map((_, seg) => (
                  <span
                    key={seg}
                    className={`h-1.5 flex-1 rounded-full ${
                      seg <= i ? "bg-amber" : "bg-border"
                    }`}
                  />
                ))}
              </span>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-text-light mb-3">
                Step {i + 1}
              </span>
              <p className="font-display text-xl font-semibold text-navy mb-1">
                {offer.name}
              </p>
              <p className="font-display text-[26px] leading-[1.15] font-semibold text-amber mb-4">
                {offer.price}
              </p>
              <p className="font-body text-[15px] text-text-mid leading-relaxed">
                {offer.summary}
              </p>
              {also && (
                <p className="mt-3 font-body text-[13px] text-text-light leading-relaxed">
                  {also.name} is {also.price}. {also.summary}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-9">
        <Link
          href="/ai-automation-services"
          className="font-body text-base font-semibold text-navy underline underline-offset-4 hover:text-amber transition-colors"
        >
          See the full ladder and every published price
        </Link>
      </div>
    </Section>
  );
}

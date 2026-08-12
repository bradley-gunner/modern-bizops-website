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
// sizes, so they share the last card. The split is worked through on /pricing,
// where a buyer is actually choosing between them.
//
// The second price rides along with the NAME that carries it. It used to sit in
// the Partner card's price line as "$2,500 a month or $8,000 a month", which
// put two prices under one product name while /pricing sold the second one as a
// separately named rung. Nothing on this page states a rung total any more
// either, because the page shows four cards and /pricing lists five.
const RUNGS = [
  { id: "scan" },
  { id: "audit" },
  { id: "builds" },
  { id: "partner", also: "partner-plus" },
];

export default function TheLadder() {
  return (
    <Section bg="white" narrow={false} id="how-it-works">
      <div className="max-w-[760px] mb-10">
        <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
          The ladder. You can stop at any rung.
        </h2>
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
          Nothing here requires the next thing. The first rung is free and you
          can do it right now without talking to anyone.
        </p>
      </div>

      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {RUNGS.map((step, i) => {
          const offer = rung[step.id];
          const also = step.also ? rung[step.also] : null;
          return (
            <li
              key={step.id}
              className="bg-cream rounded-[14px] p-6 flex flex-col"
            >
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-text-light mb-3">
                Step {i + 1}
              </span>
              <p className="font-display text-xl font-semibold text-navy mb-1">
                {offer.name}
              </p>
              <p className="font-body text-sm font-semibold text-amber mb-3">
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
          href="/pricing"
          className="font-body text-base font-semibold text-navy underline underline-offset-4 hover:text-amber transition-colors"
        >
          See the full ladder and every published price
        </Link>
      </div>
    </Section>
  );
}

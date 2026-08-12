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
// Four rungs, not five: Partner and Partner Plus are one decision with two
// sizes, so they share a card and the second price. The split lives on
// /pricing where a buyer is actually choosing between them.
const RUNGS = [
  { id: "scan", price: rung.scan.price },
  { id: "audit", price: rung.audit.price },
  { id: "builds", price: rung.builds.price },
  {
    id: "partner",
    price: `${rung.partner.price} or ${rung["partner-plus"].price}`,
  },
];

export default function TheLadder() {
  return (
    <Section bg="white" narrow={false} id="how-it-works">
      <div className="max-w-[760px] mb-10">
        <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
          Four rungs. You can stop at any of them.
        </h2>
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
          Nothing here requires the next thing. The first rung is free and you
          can do it right now without talking to anyone.
        </p>
      </div>

      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {RUNGS.map((step, i) => {
          const offer = rung[step.id];
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
                {step.price}
              </p>
              <p className="font-body text-[15px] text-text-mid leading-relaxed">
                {offer.summary}
              </p>
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

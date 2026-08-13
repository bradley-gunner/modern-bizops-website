import Link from "next/link";
import Section from "../ui/Section";
import { HOMEPAGE_BUILDS } from "@/lib/offers";

// Section 4: services as cards with from-prices visible (the CIENCE pattern).
// Publishing real numbers here is the cheapest differentiation available: only
// 4 of the 12 torn-down competitor sites publish any, and 49% of buyers name
// opaque pricing as the single thing they most want fixed.
//
// Six of the twelve, rendered from lib/offers.js so the homepage can never
// disagree with the Services or Pricing page about a price.
//
// 2026-08-12: six cards of name, price and scope read as one uniform block of
// text, so every card now leads with the price at display scale and draws its
// clock as a four-week meter. Both are already-published facts given a shape,
// not new claims: the meter reads its notches out of build.clock, and the exact
// words ("1 to 2 weeks") still sit beside it for anyone who cannot see it.

const WEEK_NOTCHES = 4;

// "1 to 2 weeks" reads as a solid notch and a half-weight one; "2 weeks" reads
// as two solid. A band should not render as a promise of its ceiling.
function clockRange(clock) {
  const numbers = [...String(clock).matchAll(/\d+/g)].map(Number);
  return {
    min: numbers[0] ?? 0,
    max: numbers[numbers.length - 1] ?? 0,
  };
}

function ClockMeter({ clock }) {
  const { min, max } = clockRange(clock);
  return (
    <span aria-hidden="true" className="flex gap-1">
      {Array.from({ length: WEEK_NOTCHES }, (_, i) => {
        const week = i + 1;
        const tone =
          week <= min ? "bg-navy" : week <= max ? "bg-navy/35" : "bg-border";
        return (
          <span key={week} className={`h-1.5 w-4 rounded-full ${tone}`} />
        );
      })}
    </span>
  );
}

export default function BuildsPreview() {
  return (
    <Section bg="cream" narrow={false}>
      <div className="max-w-[760px] mb-10">
        <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-4">
          Named systems, published prices.
        </h2>
        <p className="font-body text-text-mid text-base md:text-lg leading-relaxed">
          Each one is a fixed price, a named scope, and a clock. The runbook
          goes to a named person on your side. Here are six of the twelve.
        </p>
      </div>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {HOMEPAGE_BUILDS.map((build) => (
          <li
            key={build.id}
            className="bg-white border border-border rounded-[14px] p-6 flex flex-col"
          >
            <p className="font-display text-xl font-semibold text-navy mb-2">
              {build.name}
            </p>
            <p className="font-display text-[26px] leading-[1.15] font-semibold text-amber mb-3">
              From {build.price}
            </p>
            <p className="flex items-center gap-3 mb-4">
              <ClockMeter clock={build.clock} />
              <span className="font-body text-[13px] font-medium text-text-light">
                {build.clock}
              </span>
            </p>
            <p className="font-body text-[15px] text-text-mid leading-relaxed">
              {build.scope}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-9">
        <Link
          href="/ai-automation-services"
          className="font-body text-base font-semibold text-navy underline underline-offset-4 hover:text-amber transition-colors"
        >
          See all twelve builds and what each one costs
        </Link>
      </div>
    </Section>
  );
}

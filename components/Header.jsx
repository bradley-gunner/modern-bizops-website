"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./ui/Button";

// The boutique pattern: a radically shallow nav, with the depth pushed into the
// footer. Five destinations plus one CTA, and nothing that only exists as a
// homepage anchor.
//
// ONE ARRAY, RENDERED TWICE. The desktop and mobile menus used to be two
// hand-maintained copies of the same six links, which is how "Results" survived
// in both after the homepage section carrying its anchor was deleted, leaving a
// nav item that scrolled to nothing. They now map the same source, so the two
// menus cannot disagree.
const NAV_LINKS = [
  { label: "Services", href: "/ai-automation-services" },
  { label: "Pricing", href: "/pricing" },
  { label: "The Audit", href: "/ai-readiness-assessment" },
  { label: "Learn", href: "/learn" },
  { label: "About", href: "/about" },
];

// One primary CTA site-wide, and it is the free Scan. It stays a <Button> so
// the click is tracked: Button fires cta_click only for hrefs in its own
// CTA_DESTINATIONS map, and /scorecard is in it.
const NAV_CTA = { label: "Get the Free Scan", href: "/scorecard" };

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-border">
      {/* The logo is the company lockup, not the personal one. It is also a
          TRIMMED crop of /logos/horizontal-full-color-light.png, because the
          official asset is 72 percent empty canvas: dropped in untrimmed it
          renders the artwork at under half the size of what it replaced, and
          its padding pushed the mark about 40px right of where the rest of the
          page starts. Trimmed, it aligns with the container edge, so -ml-3 is
          gone and the padding that used to come baked into the PNG now lives
          on this div, which keeps the header the same height it always was. */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 flex items-center justify-between py-4 md:py-[22px]">
        <Link href="/">
          <Image
            src="/logos/horizontal-full-color-light-trimmed.png"
            alt="Modern BizOps"
            width={697}
            height={251}
            sizes="(max-width: 768px) 110px, 145px"
            className="h-[39px] md:h-[52px] w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-sm text-text-mid hover:text-navy transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {/* ctaLocation follows the site-wide <cluster>_<position> shape so
              cta_location splits the same way in GA4 everywhere: the cluster is
              everything before the last underscore, the position is the last
              segment. The nav sits at the top of every page, so its position is
              hero. These read "nav" and "nav_mobile" until 2026-08-11; a GA4
              filter written against the old values needs updating. */}
          <Button href={NAV_CTA.href} size="small" ctaLocation="nav_hero">
            {NAV_CTA.label}
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg
            className="h-6 w-6 text-navy"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav aria-label="Mobile navigation" className="md:hidden border-t border-border bg-cream px-6 py-4 space-y-4">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block font-body text-text-mid hover:text-navy"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button
            href={NAV_CTA.href}
            size="small"
            className="w-full"
            ctaLocation="nav_mobile_hero"
            onClick={() => setMobileOpen(false)}
          >
            {NAV_CTA.label}
          </Button>
        </nav>
      )}
    </header>
  );
}

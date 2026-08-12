"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

// Sticky mobile CTA, rendered on the homepage only. It appears once the reader
// has scrolled past the hero, so the primary CTA is never more than a thumb
// away on the surface where the page is longest.
//
// It used to point at /book with "Book a Free Call", which was the old funnel:
// the first ask was a call. The Scan is now the one primary CTA site-wide, and
// the hero and the closing block both send there, so a bar that asked for a
// call was the single loudest contradiction of that rule on the page.
//
// It also used to be a bare <Link>, which fires no cta_click at all. It is a
// <Button> now, so this bar is measurable against the hero and the close
// instead of being invisible in GA4.
export default function MobileCtaBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-xl px-4 py-3 flex items-center gap-3"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      role="complementary"
      aria-label="Get the Free Scan"
    >
      <Button
        href="/scorecard"
        className="flex-1"
        ctaLocation="home_mobile_foot"
      >
        Get the Free Scan
      </Button>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-text-mid hover:bg-cream-dark transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

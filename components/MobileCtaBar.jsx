"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
      aria-label="Book a call"
    >
      <Link
        href="/book"
        className="flex-1 inline-flex items-center justify-center bg-amber text-white font-body font-semibold rounded-full py-3 px-6 text-base hover:bg-amber-hover transition-colors"
      >
        Book a Free Call
      </Link>
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

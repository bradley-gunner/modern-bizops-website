"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./ui/Button";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 flex items-center justify-between py-0">
        <Link href="/" className="-ml-3">
          <Image
            src="/logos/horizontal-full-color-light.png"
            alt="Modern BizOps"
            width={560}
            height={152}
            className="h-18 md:h-24 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          <Link
            href="/#how-it-works"
            className="font-body text-sm text-text-mid hover:text-navy transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#results"
            className="font-body text-sm text-text-mid hover:text-navy transition-colors"
          >
            Results
          </Link>
          <Link
            href="/#faq"
            className="font-body text-sm text-text-mid hover:text-navy transition-colors"
          >
            FAQ
          </Link>
          <Button href="/book" size="small">
            Book a Discovery Call
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
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
          <Link
            href="/#how-it-works"
            className="block font-body text-text-mid hover:text-navy"
            onClick={() => setMobileOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/#results"
            className="block font-body text-text-mid hover:text-navy"
            onClick={() => setMobileOpen(false)}
          >
            Results
          </Link>
          <Link
            href="/#faq"
            className="block font-body text-text-mid hover:text-navy"
            onClick={() => setMobileOpen(false)}
          >
            FAQ
          </Link>
          <Button href="/book" size="small" className="w-full">
            Book a Discovery Call
          </Button>
        </nav>
      )}
    </header>
  );
}

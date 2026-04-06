import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export const metadata = {
  title: "Watch How It Works",
  description:
    "See how Modern BizOps helps $3M–$15M companies build revenue engines that grow without proportional headcount growth.",
  alternates: {
    canonical: "https://modernbizops.com/watch",
  },
};

export default function WatchPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header — logo only */}
      <div className="px-6 md:px-8 py-5">
        <Link href="/">
          <Image
            src="/logos/horizontal-full-color-light.png"
            alt="Modern BizOps"
            width={560}
            height={152}
            className="h-14 md:h-[88px] w-auto"
            priority
          />
        </Link>
      </div>

      <main className="mx-auto max-w-[900px] px-6 md:px-8 py-8 md:py-16">
        {/* Video embed placeholder */}
        <div className="aspect-video bg-navy rounded-[14px] flex items-center justify-center mb-10">
          <div className="text-center text-white">
            <svg
              className="mx-auto h-20 w-20 mb-4 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
            <p className="font-body text-sm opacity-60">
              Video Sales Letter placeholder
            </p>
            <p className="font-body text-xs opacity-40 mt-1">
              Replace with YouTube/Vimeo embed
            </p>
          </div>
        </div>

        {/* CTA copy */}
        <div className="text-center mb-10">
          <h1 className="font-display text-[28px] md:text-[38px] font-semibold text-navy mb-4">
            Ready to Grow Your Revenue Without Growing Your Team?
          </h1>
          <p className="font-body text-text-mid text-lg mb-8">
            Book your free discovery call below.
          </p>
        </div>

        {/* HubSpot Meetings Calendar Embed */}
        <div className="mb-10">
          <div
            className="meetings-iframe-container"
            data-src="https://meetings-na2.hubspot.com/bradley-de-wet/revops-coaching-discovery-call?embed=true"
          ></div>
          <Script
            src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
            strategy="afterInteractive"
          />
        </div>

        {/* Trust indicators */}
        <p className="text-center font-body text-sm text-text-mid">
          15+ companies transformed · 45-minute call · No obligation
        </p>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border px-6 py-4 text-center">
        <div className="flex justify-center gap-6">
          <Link
            href="/privacy"
            className="font-body text-xs text-text-light hover:text-text-mid transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="font-body text-xs text-text-light hover:text-text-mid transition-colors"
          >
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import HubSpotMeetingRedirect from "@/components/HubSpotMeetingRedirect";

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
        {/* VSSL \u2014 YouTube unlisted embed.
            rel=0             : only show recommendations from this channel at end.
            modestbranding=1  : minimize YouTube branding on the player chrome.
            playsinline=1     : iOS plays inline instead of forcing fullscreen.
            color=white       : progress bar matches cream/navy palette better than red. */}
        <div className="aspect-video rounded-[14px] overflow-hidden mb-10 shadow-lg">
          <iframe
            src="https://www.youtube-nocookie.com/embed/4fVPWZ8MNEg?rel=0&modestbranding=1&playsinline=1&color=white"
            title="How $3M-$15M Founders Grow Revenue Without Growing Headcount"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full border-0"
          ></iframe>
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
        <HubSpotMeetingRedirect source="watch" />
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

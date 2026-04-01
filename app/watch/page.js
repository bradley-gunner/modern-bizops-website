import Link from "next/link";

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
        <Link
          href="/"
          className="font-display text-xl font-semibold text-navy"
        >
          Modern BizOps
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

        {/* Calendar embed placeholder */}
        <div className="bg-cream border border-border rounded-[14px] p-8 md:p-12 mb-10">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-text-light mb-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            <p className="font-body text-text-mid font-medium mb-2">
              HubSpot Meetings Calendar
            </p>
            <p className="font-body text-sm text-text-light">
              Replace this placeholder with your HubSpot Meetings embed code
            </p>
            {/*
              To embed HubSpot Meetings, replace this div with:
              <div className="meetings-iframe-container" data-src="YOUR_HUBSPOT_MEETINGS_URL?embed=true"></div>
              <script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>
            */}
          </div>
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

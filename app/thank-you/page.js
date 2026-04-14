import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import TrackConversion from "@/components/TrackConversion";
import PrepCTACard from "@/components/PrepCTACard";

export const metadata = {
  title: "You're Booked!",
  description: "Your discovery call is confirmed. Here's what to expect.",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ searchParams }) {
  const params = (await searchParams) || {};
  const email = typeof params.email === "string" ? params.email : "";
  const firstName =
    typeof params.firstName === "string" ? params.firstName : "";

  return (
    <>
      <Suspense fallback={null}>
        <TrackConversion />
      </Suspense>
      <Header />
      <main>
        <Section bg="white">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-pale rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="h-8 w-8 text-green"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h1 className="font-display text-[32px] md:text-[42px] font-semibold text-navy mb-4">
              You&apos;re Booked!
            </h1>
            <p className="font-body text-text-mid text-lg">
              Here&apos;s what&apos;s next.
            </p>
          </div>

          {/* Prep questionnaire CTA — primary next action */}
          <PrepCTACard email={email} firstName={firstName} />

          {/* What to expect */}
          <div className="bg-cream rounded-[14px] p-6 md:p-8 mb-8">
            <h2 className="font-display text-2xl font-semibold text-navy mb-4">
              What to Expect
            </h2>
            <p className="font-body text-text-primary leading-relaxed">
              This is a real conversation — not a sales pitch. We&apos;ll talk
              about:
            </p>
            <ul className="mt-4 space-y-3">
              {[
                "Where your revenue engine is right now",
                "What's working and what isn't",
                "Whether I can help — and if so, exactly how",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-green mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="font-body text-text-primary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div className="border-t border-border pt-8">
            <h2 className="font-display text-2xl font-semibold text-navy mb-3">
              Follow Along
            </h2>
            <p className="font-body text-text-mid mb-4">
              See what we&apos;re working on and get insights before your call.
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/in/bradleydewet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-full font-body text-sm hover:bg-navy-mid transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://youtube.com/@modernbizops"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-text-primary rounded-full font-body text-sm hover:border-navy-mid transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

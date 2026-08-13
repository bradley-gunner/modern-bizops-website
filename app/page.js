import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCtaBar from "@/components/MobileCtaBar";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import OperationsDebt from "@/components/home/OperationsDebt";
import BuildsPreview from "@/components/home/BuildsPreview";
import TheLadder from "@/components/home/TheLadder";
import Mechanism from "@/components/home/Mechanism";
import FounderNote from "@/components/home/FounderNote";
import HomeFaq from "@/components/home/HomeFaq";
import FinalCta from "@/components/home/FinalCta";
import { getFAQSchema } from "./schema";

const URL = "https://modernbizops.com";
const OG_IMAGE = "https://modernbizops.com/og/og-homepage.png";
const TITLE = "AI Automation Partner for B2B Go-to-Market";
const DESCRIPTION =
  "The AI automation partner for B2B go-to-market: more leads, more booked calls, more closed deals, and a team with less busywork. Fixed published prices.";

// The homepage keeps the brand suffix: 42 characters plus the 16-character
// " | Modern BizOps" renders at 58, inside Google's truncation point, and this
// is the one page where the brand is worth paying for.
//
// It has to be written out rather than left to the root template. Next applies
// title.template to CHILD segments only, never to the segment that declares
// it, and app/page.js is the root layout's own segment. A bare title string
// here renders as 42 characters with no brand at all. Verified by building and
// reading .next/server/app/index.html, which is the only way to check a title
// on this site: the source string is never the rendered tag.
const RENDERED_TITLE = `${TITLE} | Modern BizOps`;

export const metadata = {
  title: { absolute: RENDERED_TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: RENDERED_TITLE,
    description: DESCRIPTION,
    url: URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Modern BizOps, the AI automation partner for B2B go-to-market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: RENDERED_TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

// The nine-section anatomy, in order. Every section is load-bearing and the
// order is the deliverable: hero, then trust immediately (never later), then
// the honest diagnosis, then what you can buy at what price, then the ladder
// that gets you there, then the mechanism behind the claims, then the person,
// then the objections, then the close.
export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustStrip />
        <OperationsDebt />
        <BuildsPreview />
        <TheLadder />
        <Mechanism />
        <FounderNote />
        <HomeFaq />
        <FinalCta />
      </main>
      {/* FAQPage schema lives with the page that shows these Q&As, matching the
          <HomeFaq /> above. Both read the same array (lib/homeFaq.js), so the
          structured data cannot drift from what a visitor can see. It used to
          be emitted site-wide from the root layout, which put it on pages that
          never render this FAQ. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQSchema()) }}
      />
      <Footer />
      <MobileCtaBar />
    </>
  );
}

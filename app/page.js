import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCtaBar from "@/components/MobileCtaBar";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Problem from "@/components/sections/Problem";
import PullQuote from "@/components/sections/PullQuote";
import CostOfInaction from "@/components/sections/CostOfInaction";
import Solution from "@/components/sections/Solution";
import HowItWorks from "@/components/sections/HowItWorks";
import Results from "@/components/sections/Results";
import ScorecardCTA from "@/components/sections/ScorecardCTA";
import AboutCoach from "@/components/sections/AboutCoach";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import { getFAQSchema } from "./schema";

export const metadata = {
  // The approved title carries the validated "revenue per employee" term, so
  // it must ship exactly as written: absolute keeps the root layout's
  // "%s | Modern BizOps" template from appending a second suffix.
  title: {
    absolute:
      "Grow Revenue Without Growing Headcount | Revenue Per Employee Coaching for $3M-$50M B2B",
  },
  description:
    "Software-assisted RevOps coaching for founder-led B2B companies from $3M to $50M. I benchmark your revenue per employee, find the operational gap costing you the most, and coach your team to close it.",
  alternates: {
    canonical: "https://modernbizops.com",
  },
  openGraph: {
    title:
      "Grow Revenue Without Growing Headcount | Revenue Per Employee Coaching for $3M-$50M B2B",
    description:
      "Done-with-you coaching that builds the sales, marketing, and delivery systems that turn growth into profit.",
    url: "https://modernbizops.com",
    images: [
      {
        url: "https://modernbizops.com/og/og-homepage.png",
        width: 1200,
        height: 630,
        alt: "Modern BizOps - Grow Your Revenue Without Growing Your Headcount",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Grow Revenue Without Growing Headcount | Revenue Per Employee Coaching for $3M-$50M B2B",
    description:
      "Done-with-you coaching for founder-led B2B companies from $3M to $50M.",
    images: ["https://modernbizops.com/og/og-homepage.png"],
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustBar />
        <Problem />
        <PullQuote />
        <CostOfInaction />
        <Solution />
        <HowItWorks />
        <Results />
        <ScorecardCTA />
        <AboutCoach />
        <FAQ />
        <FinalCTA />
      </main>
      {/* FAQPage schema lives with the page that shows these Q&As, matching the
          <FAQ /> above. It used to be emitted site-wide from the root layout,
          which put it on pages that never render this FAQ. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQSchema()) }}
      />
      <Footer />
      <MobileCtaBar />
    </>
  );
}

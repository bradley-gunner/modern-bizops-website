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
import MidPageCTA from "@/components/sections/MidPageCTA";
import AboutCoach from "@/components/sections/AboutCoach";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata = {
  title: "Grow Your Revenue Without Growing Your Headcount | Modern BizOps",
  description:
    "I help $3M–$15M companies build the sales, marketing, and delivery systems that turn growth into profit. Done-with-you revenue operations coaching.",
  alternates: {
    canonical: "https://modernbizops.com",
  },
  openGraph: {
    title: "Grow Your Revenue Without Growing Your Headcount",
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
    title: "Grow Your Revenue Without Growing Your Headcount",
    description:
      "Done-with-you coaching for $3M-$15M companies.",
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
        <MidPageCTA />
        <AboutCoach />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}

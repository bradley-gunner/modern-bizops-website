import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import CostOfInaction from "@/components/sections/CostOfInaction";
import Solution from "@/components/sections/Solution";
import HowItWorks from "@/components/sections/HowItWorks";
import Results from "@/components/sections/Results";
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
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <CostOfInaction />
        <Solution />
        <HowItWorks />
        <Results />
        <AboutCoach />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

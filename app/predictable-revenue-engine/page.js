import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import MaturityHero from "@/components/maturity/MaturityHero";
import SelfLocate from "@/components/maturity/SelfLocate";
import MaturityExperience from "@/components/maturity/MaturityExperience";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import { getHeroVariant } from "@/lib/maturity/heroVariants";
import { MATURITY_FAQ } from "@/lib/maturity/faq";

const URL = "https://modernbizops.com/predictable-revenue-engine";

export const metadata = {
  // The root layout applies a "%s | Modern BizOps" title template, so this must
  // not repeat the brand or the tab reads "... | Modern BizOps | Modern BizOps".
  title: "Revenue Operations: The Four Stages From Founder-Led to Predictable",
  description:
    "The four stages and 44 competencies that move a founder-led business from revenue that depends on you to revenue you can predict. See exactly how each one is measured.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Revenue Operations: The Four Stages From Founder-Led to Predictable",
    description:
      "From revenue that runs on you to revenue you can predict. Four stages, 44 competencies.",
    url: URL,
    images: [
      {
        url: "https://modernbizops.com/og/og-maturity-model.png",
        width: 1200,
        height: 630,
        alt: "The Revenue Operations Maturity Model",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Revenue Operations: The Four Stages From Founder-Led to Predictable",
    description:
      "Four stages, 44 competencies, from revenue that runs on you to revenue you can predict.",
    images: ["https://modernbizops.com/og/og-maturity-model.png"],
  },
};

export default function MaturityModelPage() {
  const variant = getHeroVariant();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MATURITY_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://modernbizops.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "The Revenue Operations Maturity Model",
        item: URL,
      },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <MaturityHero variant={variant} />

        <Section bg="white" narrow={false}>
          <div className="max-w-[760px] mx-auto text-center">
            <h2 className="font-display font-semibold text-navy text-3xl md:text-[34px] leading-tight">
              Maturity is not about your revenue band. It is about how much of
              your revenue runs on a system instead of on you.
            </h2>
            <p className="text-lg text-text-mid mt-5">
              The question is not &ldquo;how much am I missing?&rdquo; It is
              &ldquo;where am I, and what is the next right thing to build?&rdquo;
            </p>
            <p className="text-lg text-text-mid mt-6">
              The Revenue Operations Maturity Model has a total of forty-four
              competencies, broken into four maturity stages. You do not need all
              forty-four. You need to improve in the{" "}
              <span className="text-amber font-semibold italic">three or four</span>{" "}
              that matter for where you are right now.
            </p>
          </div>
        </Section>

        <Section bg="cream" narrow={false}>
          <SelfLocate />
        </Section>

        <Section bg="navy" narrow>
          <div className="text-center">
            <h2 className="font-display font-semibold text-3xl mb-2">
              Want to know exactly where you are?
            </h2>
            <p className="text-white/80 mb-6 max-w-[58ch] mx-auto">
              The free AI Revenue Scan runs this model against your business in
              about five minutes and names the one gap we would fix first. It is
              the structured version of what you just did by feel.
            </p>
            <Button href="/scorecard">Get the Free Scan</Button>
          </div>
        </Section>

        <Section bg="white" narrow={false}>
          <details className="group">
            <summary className="list-none cursor-pointer text-center [&::-webkit-details-marker]:hidden">
              <div className="text-xs tracking-widest uppercase text-amber font-semibold">
                For the operators who want to look under the hood
              </div>
              <div className="font-display font-semibold text-navy text-2xl md:text-3xl mt-1">
                The full map{" "}
                <span className="text-amber font-normal">
                  · four stages, 44 competencies
                </span>
              </div>
              <div className="text-sm text-text-light mt-2 max-w-[62ch] mx-auto">
                This is the whole framework and how we measure each part. You would
                never work on all of it at once.
              </div>
              <div className="mt-3 text-amber text-sm font-semibold group-open:hidden">
                Show the full map ↓
              </div>
              <div className="mt-3 text-amber text-sm font-semibold hidden group-open:block">
                Hide the full map ↑
              </div>
            </summary>
            <div className="mt-12">
              <MaturityExperience />
            </div>
          </details>
        </Section>

        <Section bg="cream" narrow>
          <h2 className="font-display font-semibold text-navy text-3xl mb-6 text-center">
            Questions founders ask
          </h2>
          <MaturityFaq items={MATURITY_FAQ} />
        </Section>

        <Section bg="white" narrow>
          <div className="text-center">
            <h2 className="font-display font-semibold text-navy text-3xl mb-2">
              See where you stand
            </h2>
            <p className="text-text-mid mb-6">
              Book a discovery call and we will walk your revenue operation
              stage by stage.
            </p>
            <Button href="/book">Book a Discovery Call</Button>
          </div>
        </Section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}

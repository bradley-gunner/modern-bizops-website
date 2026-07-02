import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import MaturityHero from "@/components/maturity/MaturityHero";
import StageOverview from "@/components/maturity/StageOverview";
import MaturityExperience from "@/components/maturity/MaturityExperience";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import { getHeroVariant } from "@/lib/maturity/heroVariants";
import { MATURITY_FAQ } from "@/lib/maturity/faq";

const URL = "https://modernbizops.com/predictable-revenue-engine";

export const metadata = {
  title: "The Revenue Operations Maturity Model | Modern BizOps",
  description:
    "The four stages and 44 competencies that move a founder-led business from revenue that depends on you to revenue you can predict. See exactly how each one is measured.",
  alternates: { canonical: URL },
  openGraph: {
    title: "The Revenue Operations Maturity Model",
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
    title: "The Revenue Operations Maturity Model",
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

        <Section bg="cream" narrow={false}>
          <div className="max-w-[720px] mx-auto text-center">
            <p className="text-lg text-text-mid">
              This is the methodology behind the engagement. Maturity is not
              about your revenue band. It is about how much of your revenue runs
              on a system instead of on you.
            </p>
          </div>
          <div className="mt-12">
            <StageOverview />
          </div>
        </Section>

        <Section bg="white" narrow={false}>
          <MaturityExperience />
        </Section>

        <Section bg="navy" narrow>
          <div className="text-center">
            <h2 className="font-display font-semibold text-3xl mb-2">
              Want your own score?
            </h2>
            <p className="text-white/80 mb-6 max-w-[56ch] mx-auto">
              The scorecard runs this exact model against your business in about
              five minutes and shows you the one gap I would fix first.
            </p>
            <Button href="/scorecard">Get your Revenue Maturity Score</Button>
          </div>
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

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import LearnHero from "@/components/learn/LearnHero";
import AuthorCard from "@/components/learn/AuthorCard";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import AiConsultingBody from "@/components/ai-consulting/AiConsultingBody";
import { AUTHOR_CREDENTIAL, BYLINE } from "@/lib/learn/registry";
import { LADDER } from "@/lib/offers";

// Prices in the FAQ come from the ladder rather than being typed here, so a
// price can never disagree with itself across surfaces. Published prices are
// the differentiation, so a stale number on this page is a real defect.
const rung = (id) => LADDER.find((r) => r.id === id);

// Root-level, OFF-NAV BOFU service page: the AI-accelerant framing of the same
// offer as /revenue-operations-consulting. Built as a standalone page
// (not through the /learn registry) and deliberately kept out of the primary and
// footer navigation; it exists for organic search and future paid ads.
const URL = "https://modernbizops.com/ai-consulting-for-small-business";
const OG_IMAGE = "https://modernbizops.com/og/og-service-ai-consulting.png";
// Title, dek and meta below are the strings approved in the step-16 retarget
// handoff. The old title ran 73 characters bare and 89 rendered, so it was
// truncated in results; the old meta promised coaching, which is retired.
const TITLE = "AI Consulting for Small Business: Foundations First";
const DEK = "Foundations first.";
const DESCRIPTION =
  "Most AI consulting for small business sells tools on a broken foundation. Fix the foundation first, then build the automation, at published fixed prices.";
const LAST_UPDATED = "2026-07-22";


// FAQ, verbatim from the spec's "Frequently asked questions" section. Single
// source of truth for both the rendered accordion and the FAQPage JSON-LD.
const FAQ = [
  {
    q: "What does an AI business consultant do?",
    a: "Most AI business consultants assess your workflows, pick high-return areas, and implement tools: chatbots, automations, forecasting models. That is useful when the process underneath is already sound. We work differently. We fix the revenue fundamentals first, then apply AI only where it accelerates a competency you have already made solid. Every build ships with a runbook and an internal owner we train, so the goal is a system your team runs without us, not a tool you rent from us.",
  },
  {
    q: "How much does an AI consultant cost?",
    a: `In this category, readiness assessments commonly run from about $2,500 to $10,000, and project builds from roughly $10,000 to $50,000, with retainers on top. Those are implementation prices. Ours are published: a free ${rung("scan").name}, a ${rung("audit").price} ${rung("audit").name}, and ${rung("builds").name} at ${rung("builds").price} for one named system at a time. The honest way to compare is not the invoice. It is whether the value stays in your business after the work is done, which is what the runbook and the trained internal owner are for.`,
  },
  {
    q: "How much does AI cost for a small business?",
    a: "The tools themselves are cheaper than most people expect. Small businesses often spend $5,000 to $50,000 on initial setup and a few hundred to a couple thousand dollars a month to run it. But the tool cost is not the real cost. Applying AI to a broken revenue process wastes the spend, because automating a broken process just produces broken outcomes faster. Fix the fundamentals first and the same tool budget returns far more.",
  },
  {
    q: "What is the best AI agent for small business?",
    a: "There is no single best agent, and that is the wrong first question. The assistants you likely already have access to, Claude, ChatGPT Enterprise, and similar, cover most of what a small B2B company needs once the process is defined. The better question is which competency in your revenue operation is sound enough to accelerate. Answer that first, and the right tool becomes obvious. Answer it wrong, and no agent will save you.",
  },
];

export const metadata = {
  // OPTS OUT OF THE BRAND SUFFIX, the way /learn/[slug] and the offer pages do.
  //
  // The step-16 handoff flagged this exact decision and left it open: the
  // approved title is 51 characters, this page is root-level rather than under
  // /learn, and the root layout's "%s | Modern BizOps" template would render it
  // at 67, past the roughly 60 characters Google shows. The handoff's own
  // instruction was to check the RENDERED length, not the bare one. Approved
  // copy is not ours to rewrite, so the suffix is what gives way.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "AI Consulting for Small Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

function formatLastUpdated(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function AiConsultingForSmallBusinessPage() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    url: URL,
    image: OG_IMAGE,
    dateModified: LAST_UPDATED,
    author: {
      "@type": "Person",
      name: "Bradley de Wet",
      jobTitle: "Founder, Modern BizOps",
      sameAs: ["https://linkedin.com/in/bradleydewet"],
    },
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
        name: "AI Consulting for Small Business",
        item: URL,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bradley de Wet",
    jobTitle: "Founder, Modern BizOps",
    sameAs: ["https://linkedin.com/in/bradleydewet"],
  };

  // Page-specific Service schema, per the build spec's recommended addition for
  // this BOFU service page. serviceType read "Revenue operations coaching
  // (AI-accelerated)" until 2026-08-12, which named a retired offer in machine
  // readable form. The page prose was rewritten off the coaching model on
  // 2026-08-18, so the schema and the copy now describe the same offer.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Consulting for Small Business",
    serviceType: "AI consulting for small business",
    url: URL,
    description: DESCRIPTION,
    provider: {
      "@type": "Organization",
      name: "Modern BizOps",
      url: "https://modernbizops.com",
      founder: { "@type": "Person", name: "Bradley de Wet" },
    },
    areaServed: { "@type": "Country", name: "United States" },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "B2B companies with a real sales motion, $1M to $50M revenue",
    },
  };

  const schemas = [articleLd, breadcrumbLd, faqLd, personLd, serviceLd];

  return (
    <>
      <Header />
      <main>
        <LearnHero
          h1="AI Consulting for Small Business"
          accentWord="Consulting"
          dek={DEK}
          byline={`${BYLINE} Last updated ${formatLastUpdated(LAST_UPDATED)}.`}
          motif="amplifier"
          theme="navy"
          cta={
            <div className="flex flex-col items-start gap-2.5">
              <Button href="/book" ctaLocation="ai_consulting_hero">
                Book a call
              </Button>
              <span className="max-w-[42ch] text-[13px] leading-snug text-text-light">
                A free call. We will tell you honestly whether this is a fit,
                including if the answer is not yet.
              </span>
            </div>
          }
        />

        <Section bg="cream" narrow={false} className="pt-10 md:pt-12">
          <div className="mx-auto max-w-[760px]">
            <article className="space-y-6 text-lg leading-relaxed text-text-mid">
              <AiConsultingBody />
            </article>

            <AuthorCard credential={AUTHOR_CREDENTIAL} />
          </div>
        </Section>

        <Section bg="white" narrow>
          <h2 className="mb-6 text-center font-display text-3xl font-semibold text-navy">
            Frequently asked questions
          </h2>
          <MaturityFaq items={FAQ} />
        </Section>
      </main>
      <Footer />
      {schemas.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
    </>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import LearnHero from "@/components/learn/LearnHero";
import AuthorCard from "@/components/learn/AuthorCard";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import AiConsultingBody from "@/components/ai-consulting/AiConsultingBody";
import { AUTHOR_CREDENTIAL } from "@/lib/learn/registry";

// Root-level, OFF-NAV BOFU service page: the AI-accelerant framing of the same
// coaching offer at /revenue-operations-consulting. Built as a standalone page
// (not through the /learn registry) and deliberately kept out of the primary and
// footer navigation; it exists for organic search and future paid ads.
const URL = "https://modernbizops.com/ai-consulting-for-small-business";
const OG_IMAGE = "https://modernbizops.com/og/og-service-ai-consulting.png";
const TITLE =
  "AI Consulting for Small Business: Foundations First, Then the Acceleration";
const DESCRIPTION =
  "Most AI consulting for small business sells tools. I coach your team to fix the revenue fundamentals first, then apply AI where it actually accelerates.";
const LAST_UPDATED = "2026-07-22";

// Locked byline, verbatim from the approved spec (matches lib/learn/registry's
// BYLINE). Do not name the agency.
const BYLINE =
  "By Bradley de Wet, founder of Modern BizOps. 15 years in revenue operations, including building revenue systems at Contactually (VC-backed SaaS), founding Tasting Club, and serving as COO and leader of account management at a boutique digital marketing agency.";

// FAQ, verbatim from the spec's "Frequently asked questions" section. Single
// source of truth for both the rendered accordion and the FAQPage JSON-LD.
const FAQ = [
  {
    q: "What does an AI business consultant do?",
    a: "Most AI business consultants assess your workflows, pick high-return areas, and implement tools: chatbots, automations, forecasting models. That is useful when the process underneath is already sound. I work differently. I coach your own team to fix the revenue fundamentals first, then apply AI only where it accelerates a competency you have already made solid. The goal is a system your team runs without me, not a tool you rent from me.",
  },
  {
    q: "How much does an AI consultant cost?",
    a: "In this category, readiness assessments commonly run from about $2,500 to $10,000, and project builds from roughly $10,000 to $50,000, with retainers on top. Those are implementation prices. My engagement is coaching, priced against the capability your team keeps rather than a one-time build they cannot maintain. The honest way to compare is not the invoice. It is whether the value stays in your business after the work is done.",
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
  // Root layout applies a "%s | Modern BizOps" template, so this is the bare
  // title tag; the brand suffix is added once by the template.
  title: TITLE,
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
  // this BOFU service page. It describes the actual offer: the AI-accelerated
  // framing of the revenue operations coaching engagement.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Consulting for Small Business",
    serviceType: "Revenue operations coaching (AI-accelerated)",
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
      audienceType: "Founder-led B2B companies from $3M to $50M in revenue",
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
          dek="Foundations first, then the acceleration."
          byline={`${BYLINE} Last updated ${formatLastUpdated(LAST_UPDATED)}.`}
          motif="amplifier"
          theme="navy"
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

        {/* Closing CTA. Same /book destination as the hero and mid-body CTAs; a
            distinct cta_location so the three can be compared in GA4. */}
        <Section bg="navy" narrow>
          <div className="text-center">
            <h2 className="mb-2 font-display text-3xl font-semibold text-white">
              Start with where your fundamentals actually stand
            </h2>
            <p className="mx-auto mb-6 max-w-[52ch] text-white/80">
              Book a call and we will start with an honest read on which parts of
              your revenue operation are ready for AI, and which are not yet.
            </p>
            <Button href="/book" ctaLocation="ai_consulting_foot">
              Book a call
            </Button>
          </div>
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

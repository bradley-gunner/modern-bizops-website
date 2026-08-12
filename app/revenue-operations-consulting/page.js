import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import LearnHero from "@/components/learn/LearnHero";
import AuthorCard from "@/components/learn/AuthorCard";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import RevenueConsultingBody from "@/components/revenue-consulting/RevenueConsultingBody";
import { AUTHOR_CREDENTIAL, BYLINE } from "@/lib/learn/registry";

const URL = "https://modernbizops.com/revenue-operations-consulting";
const OG_IMAGE = "https://modernbizops.com/og/og-revenue-operations-consulting.png";
const TITLE = "Revenue Operations Consulting From Someone Who Has Run the Function";
const DESCRIPTION =
  "Traditional revenue operations consulting builds the system for you and leaves. This coaches your team to build it, so it still works when the engagement ends. For founder-led B2B companies from $3M to $50M.";
const LAST_UPDATED = "2026-07-21";


// FAQ, verbatim from the spec's "Frequently asked questions" section. This array
// is the single source of truth for both the rendered accordion and the
// FAQPage JSON-LD, so the two never drift.
const FAQ = [
  {
    q: "What does a revenue operations consultant do?",
    a: "A revenue operations consultant aligns your marketing, sales, and customer success into one system so revenue becomes predictable instead of dependent on individual heroics. In practice that means fixing CRM and pipeline architecture, defining how marketing and sales hand off and hold each other accountable, operationalizing onboarding and retention, and making the numbers that run the business visible. The important distinction is whether the consultant builds it for you and leaves, or coaches your team to build it so the capability lasts.",
  },
  {
    q: "How is this different from traditional revenue operations consulting?",
    a: "Traditional consulting delivers the system, or a report, and moves on, which means the expertise leaves when the engagement ends and the process tends to drift back over time. This is a coaching model. An experienced operator coaches your own employee to build the system, using a platform that assesses the business from your real tool data, a questionnaire, and a working call, then measures the results. You own the capability afterward instead of renting it, and your team can coach the next hire on a system they built themselves.",
  },
  {
    q: "What do revenue operations include?",
    a: "Revenue operations include every function that touches revenue, from the first marketing lead through the sale and all the way through renewal and expansion. It spans marketing, sales, and customer success, plus the CRM, the data, the process, and the people that connect them. The point of the discipline is to stop running those as separate departments with separate tools and separate goals, and start running them as one engine with one definition of success.",
  },
  {
    q: "Is my company big enough to need revenue operations consulting?",
    a: "If you are a founder-led B2B company between $3M and $50M in revenue and your growth has started to depend on adding headcount, you are in the range where this pays for itself. Below that, the systems problem is usually not expensive enough yet to justify the work. Above it, you likely already have an internal team. The sweet spot is the company with real revenue and a real team but no shared operating system underneath them.",
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
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Revenue Operations Consulting" }],
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

export default function RevenueOperationsConsultingPage() {
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://modernbizops.com" },
      { "@type": "ListItem", position: 2, name: "Revenue Operations Consulting", item: URL },
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

  // Page-specific Service schema. The root layout emits a generic site-wide
  // Service; this one describes the actual offer this page sells, so it carries
  // the concrete serviceType, area served, and audience band.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Revenue Operations Consulting",
    serviceType: "Revenue operations coaching",
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
          h1="Revenue Operations Consulting"
          dek="From someone who has run the function, not just advised on it"
          byline={`${BYLINE} Last updated ${formatLastUpdated(LAST_UPDATED)}.`}
          motif="leadershipMotif"
          theme="navy"
        />

        <Section bg="cream" narrow={false} className="pt-10 md:pt-12">
          <div className="mx-auto max-w-[760px]">
            <article className="space-y-6 text-lg leading-relaxed text-text-mid">
              <RevenueConsultingBody />
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

        {/* Closing CTA. Same destination as the mid-page CTA; a distinct
            cta_location so the two can be compared in GA4. */}
        <Section bg="navy" narrow>
          <div className="text-center">
            <h2 className="mb-2 font-display text-3xl font-semibold text-white">
              See where your revenue engine stands
            </h2>
            <p className="mx-auto mb-6 max-w-[52ch] text-white/80">
              Book a call and I will give you my honest assessment of whether this
              work is a fit, including if the answer is not yet.
            </p>
            <Button href="/book" ctaLocation="how_it_works_foot">
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

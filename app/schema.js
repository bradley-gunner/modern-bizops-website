import { HOME_FAQ } from "@/lib/homeFaq";
import { LADDER, BUILD_PRICE_FLOOR, BUILD_PRICE_CEILING } from "@/lib/offers";

// Site-wide identity structured data. app/layout.js emits Organization, Service
// and Person into the <head> of EVERY page, which is what makes these three the
// highest-leverage strings on the site and the easiest to forget.
//
// They described a RevOps coaching business until 2026-08-11, months after the
// visible copy became an AI automation offer, so every page shipped
// AI-automation prose underneath coaching structured data. The Person block also
// asserted "15+ years", which the copy rules ban outright: the live LinkedIn
// headline still says fifteen, and nothing new ever repeats it. "Over a decade"
// is the only form.
//
// THE RULES THAT BIND EVERYTHING BELOW.
//   - No aggregateRating, no review, no client count, no named client. Modern
//     BizOps has zero clients. Structured data is the easiest place in the world
//     to fabricate one and the easiest place for a search engine to catch it.
//   - Prices interpolate from lib/offers.js. Never type an amount in here.
//   - No offer catalog. /pricing owns the machine-readable ladder, and a second
//     OfferCatalog on all thirty-odd pages would compete with the page that is
//     actually about the prices.

const SITE = "https://modernbizops.com";
const YOUTUBE = "https://youtube.com/@BradleydeWetModernBizOps";
const LINKEDIN = "https://linkedin.com/in/bradleydewet";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

const AUDIENCE = {
  "@type": "BusinessAudience",
  audienceType: "Founder-led B2B companies from $3M to $50M in revenue",
};

const PROVIDER = {
  "@type": "Organization",
  name: "Modern BizOps",
  url: SITE,
};

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Modern BizOps",
    url: SITE,
    logo: `${SITE}/logos/bdw-horizontal-full-color-light.png`,
    description:
      "The AI automation partner for B2B go-to-market. We build named revenue automation systems at published fixed prices for founder-led B2B companies, and your team owns everything we build.",
    slogan: "More leads, more booked calls, more closed deals, less busywork.",
    founder: {
      "@type": "Person",
      name: "Bradley de Wet",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    knowsAbout: [
      "AI automation",
      "Revenue operations",
      "Go-to-market operations",
      "CRM architecture",
      "Marketing and sales alignment",
    ],
    sameAs: [YOUTUBE],
  };
}

export function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI automation services for B2B go-to-market",
    serviceType: "AI automation services",
    provider: PROVIDER,
    url: `${SITE}/ai-automation-services`,
    description: `AI automation for marketing, sales and service, at published fixed prices. It starts with the ${rung.audit.name}, an AI readiness assessment computed from your own systems rather than a survey, then named builds from ${BUILD_PRICE_FLOOR} to ${BUILD_PRICE_CEILING}, each with a fixed scope, a runbook, and your team owning it at the end.`,
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    audience: AUDIENCE,
    // The free entry point. One Offer rather than a catalog, because it is the
    // only rung with no price to get wrong and the one every page points at.
    offers: {
      "@type": "Offer",
      name: rung.scan.name,
      description: rung.scan.summary,
      url: `${SITE}${rung.scan.href}`,
      price: 0,
      priceCurrency: "USD",
    },
  };
}

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bradley de Wet",
    jobTitle: "Founder, Modern BizOps",
    url: `${SITE}/about`,
    worksFor: {
      "@type": "Organization",
      name: "Modern BizOps",
      url: SITE,
    },
    // Every claim here is in the verified career record and is already visible
    // somewhere on the site. "Over a decade" is deliberate and is the ceiling.
    description:
      "Over a decade in the executor seat of revenue operations, including building revenue systems at Contactually, a VC-backed SaaS company, founding Tasting Club, and four and a half years as COO of a boutique digital marketing agency. Now builds AI automation for founder-led B2B go-to-market.",
    knowsAbout: [
      "AI automation",
      "Revenue operations",
      "Sales operations",
      "Marketing operations",
      "Customer lifecycle design",
    ],
    sameAs: [LINKEDIN, YOUTUBE],
  };
}

// FAQPage structured data must match the FAQs a visitor can actually see, so
// this maps the same array the homepage accordion renders rather than keeping
// a second copy of the Q&As. The previous version of this function still held
// the coaching-era Q&As after the homepage moved on, which is exactly the
// drift the shared array prevents. Emitted from app/page.js only.
export function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

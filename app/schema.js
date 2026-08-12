import { HOME_FAQ } from "@/lib/homeFaq";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Modern BizOps",
    url: "https://modernbizops.com",
    description:
      "Revenue operations consulting and coaching for founder-led B2B companies from $3M to $50M. Done-with-you coaching that builds sales, marketing, and delivery systems.",
    founder: {
      "@type": "Person",
      name: "Bradley de Wet",
    },
  };
}

export function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Revenue Operations Consulting and Coaching",
    provider: {
      "@type": "Organization",
      name: "Modern BizOps",
    },
    description:
      "Done-with-you coaching that builds the operational systems to grow revenue without proportionally growing headcount. A four-phase engagement built on the Revenue Operations Maturity Model and the Revenue Intelligence Platform.",
    areaServed: "Worldwide",
    serviceType: "Revenue Operations Consulting",
  };
}

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bradley de Wet",
    jobTitle: "Revenue Operations Consultant and Coach",
    worksFor: {
      "@type": "Organization",
      name: "Modern BizOps",
    },
    description:
      "15+ years building revenue operations inside high-growth, VC-backed startups. Helps founder-led B2B companies from $3M to $50M build revenue engines that grow without proportional headcount growth.",
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

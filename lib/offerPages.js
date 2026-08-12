import { LADDER, BUILD_PRICE_FLOOR } from "./offers";

const rung = Object.fromEntries(LADDER.map((r) => [r.id, r]));

const SITE = "https://modernbizops.com";

/**
 * The metadata for the offer pages and the founding client page, in one place.
 *
 * WHY THIS IS NOT WRITTEN INLINE IN EACH PAGE. `app/layout.js` sets a
 * "%s | Modern BizOps" title template, and Next applies it to every CHILD
 * segment. These pages are child segments, so a bare title string would render
 * 16 characters longer than it reads in the source. The approved titles run
 * from 47 to 53 characters, which the suffix would push to 63 or 69, past the
 * roughly 60 characters Google shows. Three /learn titles sat truncated for
 * three weeks because that suffix was invisible in the source.
 *
 * So every page here opts out with `title: { absolute }`, exactly as
 * /learn/[slug] does, and the opt-out lives in one builder rather than in four
 * files where one of them can quietly lose it.
 *
 * Prices interpolate from lib/offers.js. Never type a dollar amount in here.
 */
function offerPageMetadata({ path, title, description, ogImage, ogAlt }) {
  const url = `${SITE}${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function offerPage(config) {
  return {
    ...config,
    url: `${SITE}${config.path}`,
    metadata: offerPageMetadata(config),
  };
}

// The OG PNGs referenced below do not exist yet. A later task generates them
// with scripts/generate-og.mjs; the paths are the contract that task builds to.
export const OFFER_PAGES = {
  audit: offerPage({
    path: "/ai-readiness-assessment",
    title: "AI Readiness Assessment for B2B: The AI Revenue Audit",
    description: `An AI readiness assessment computed from your actual systems, not a survey. ${rung.audit.price}, credited 100% toward your first build, with a findings guarantee.`,
    ogImage: `${SITE}/og/og-ai-readiness-assessment.png`,
    ogAlt: "The AI Revenue Audit, an AI readiness assessment for B2B",
  }),

  services: offerPage({
    path: "/ai-automation-services",
    title: "AI Automation Services for B2B: 12 Fixed-Price Builds",
    description: `Twelve named revenue automation builds at published fixed prices, ${rung.builds.price}, each with a clock, a runbook, and your team owning it at the end.`,
    ogImage: `${SITE}/og/og-ai-automation-services.png`,
    ogAlt: "Revenue Automation Builds, twelve fixed-price AI automation services",
  }),

  pricing: offerPage({
    path: "/pricing",
    title: "Pricing: AI Revenue Audit, Builds, and Partner Plans",
    description: `Published fixed prices: free ${rung.scan.name}, ${rung.audit.price} audit with 100% credit forward, builds from ${BUILD_PRICE_FLOOR}, and partner plans from ${rung.partner.price}.`,
    ogImage: `${SITE}/og/og-pricing.png`,
    ogAlt: "Modern BizOps pricing: the audit, the builds, and the partner plans",
  }),

  // Not a rung on the ladder. It is the honest hand-raise that exists because
  // this company has no case study yet, so its description promises the first
  // one rather than a result.
  founding: offerPage({
    path: "/founding-clients",
    title: "Founding Clients: Be the First in Your Industry",
    description:
      "We are earning our first case study in six industries. Founding clients get the audit, the build, and founding terms, and we both say so publicly.",
    ogImage: `${SITE}/og/og-founding-clients.png`,
    ogAlt: "Founding clients: one first client in each of six industries",
  }),
};

import {
  LADDER,
  BUILD_PRICE_FLOOR,
  CLEANUP_PRICE_FLOOR,
  AUDIT_TERMS,
} from "./offers";

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
 * Prices interpolate from lib/offers.js, and so do the commercial terms that
 * travel with them: the audit credit comes from AUDIT_TERMS rather than being
 * typed as "100%" beside a price that already interpolates. Never type a dollar
 * amount in here.
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
    description: `An AI readiness assessment computed from your actual systems, not a survey. ${rung.audit.price}, credited ${AUDIT_TERMS.creditPercent} toward your first build, with a findings guarantee.`,
    ogImage: `${SITE}/og/og-ai-readiness-assessment.png`,
    ogAlt: "The AI Revenue Audit, an AI readiness assessment for B2B",
  }),

  // The services page and the pricing page merged here on 2026-09-01. They were
  // about 90% the same page (David Ellis, Tugboat website audit, slide 6), and
  // neither had any organic equity to protect: over the three months to
  // 2026-08-31 Search Console recorded one impression for /ai-automation-services
  // and no rows at all for /pricing. This slug survives because it is the one
  // that can eventually rank for the category noun; /pricing 301s here and the
  // nav keeps its "Pricing" label, because that label is the trust signal.
  services: offerPage({
    path: "/ai-automation-services",
    title: "AI Automation Services for B2B: Every Price Published",
    description: `Every number we charge, on one page. Cleanup services from ${CLEANUP_PRICE_FLOOR}, automation builds from ${BUILD_PRICE_FLOOR}, and a ${rung.audit.price} audit credited ${AUDIT_TERMS.creditPercent} forward.`,
    ogImage: `${SITE}/og/og-ai-automation-services.png`,
    ogAlt: "AI automation services and cleanup services at published fixed prices",
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

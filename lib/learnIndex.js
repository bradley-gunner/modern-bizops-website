const SITE = "https://modernbizops.com";

/**
 * Metadata for the /learn index.
 *
 * WHY IT IS NOT WRITTEN INLINE IN THE PAGE, the way most pages on this site do
 * it: a title is only checkable if a test can import it, and `app/learn/page.js`
 * is JSX in a `.js` file, which the Vitest loader will not parse. Pulling the
 * strings out here is what makes `__tests__/chrome/site-chrome.test.jsx` able to
 * measure them. `lib/offerPages.js` exists for the same reason.
 *
 * THE TITLE KEEPS THE BRAND SUFFIX ON PURPOSE. `app/layout.js` sets a
 * "%s | Modern BizOps" template and Next applies it to every CHILD segment, so
 * this 39-character title renders at 55, inside Google's roughly 60-character
 * truncation point. The offer pages and /learn/[slug] opt out with
 * `title: { absolute }` because their titles do not fit with the suffix on. This
 * one does, and an index page is where the brand is worth carrying. If the
 * title grows, re-measure before assuming it still fits.
 *
 * THE TITLE LED ON "REVENUE OPERATIONS" UNTIL 2026-08-11. That phrase is
 * demoted vocabulary now, kept only on the handful of pages that deliberately
 * target those searchers, and this index is not one of them. The library still
 * teaches the same material; the title now leads with the term the company
 * sells against.
 */
export const LEARN_INDEX = {
  path: "/learn",
  url: `${SITE}/learn`,
  title: "AI and Go-to-Market Guides for Founders",
  description:
    "Plain-language guides for B2B companies: the maturity model, the Stage 1 competencies, the benchmarks, and where AI actually helps.",
  // Generated in a later task by scripts/generate-og.mjs. The path is the
  // contract that task builds to.
  ogImage: `${SITE}/og/og-learn-index.png`,
  ogAlt: "The Modern BizOps learning library",
};

export const learnIndexMetadata = {
  title: LEARN_INDEX.title,
  description: LEARN_INDEX.description,
  alternates: {
    canonical: LEARN_INDEX.url,
  },
  openGraph: {
    title: LEARN_INDEX.title,
    description: LEARN_INDEX.description,
    url: LEARN_INDEX.url,
    images: [
      {
        url: LEARN_INDEX.ogImage,
        width: 1200,
        height: 630,
        alt: LEARN_INDEX.ogAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: LEARN_INDEX.title,
    description: LEARN_INDEX.description,
    images: [LEARN_INDEX.ogImage],
  },
};

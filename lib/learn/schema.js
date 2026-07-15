// JSON-LD builders for /learn/[slug] pages, following the same functional
// pattern as app/schema.js. Each function takes a registry entry from
// lib/learn/registry.js and returns a plain schema.org object ready for
// JSON.stringify into a <script type="application/ld+json"> tag.

export function getBreadcrumbSchema(entry) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entry.breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };
}

export function getFaqSchema(entry) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function getLearnPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bradley de Wet",
    jobTitle: "Founder, Modern BizOps",
    sameAs: ["https://linkedin.com/in/bradleydewet"],
  };
}

export function getDefinedTermSetSchema(entry) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: entry.definedTermSet.name,
    url: entry.url,
    hasDefinedTerm: entry.definedTermSet.hasDefinedTerm,
  };
}

export function getDefinedTermSchema(entry) {
  const term = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: entry.definedTerm.name,
    description: entry.definedTerm.description,
  };
  // A term can be standalone: Net Revenue Retention covers a Stage 3
  // competency but no Stage 3 hub (and so no DefinedTermSet) exists yet. The
  // set reference gets added if/when a Stage 3 hub ships.
  if (entry.definedTerm.inDefinedTermSetUrl) {
    term.inDefinedTermSet = { "@id": entry.definedTerm.inDefinedTermSetUrl };
  }
  return term;
}

// Pillar-map pages (pageType "article") sit outside the maturity-stage
// DefinedTermSet hierarchy entirely and carry Article schema instead.
export function getArticleSchema(entry) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.metaDescription,
    url: entry.url,
    image: entry.ogImage,
    dateModified: entry.lastUpdated,
    author: {
      "@type": "Person",
      name: "Bradley de Wet",
      jobTitle: "Founder, Modern BizOps",
      sameAs: ["https://linkedin.com/in/bradleydewet"],
    },
  };
}

// Fixed lastModified dates so search engines get stable change-frequency
// signals instead of "everything changed on every build". Update these
// manually when a page's content actually changes.

const LAST_MODIFIED = {
  home: "2026-04-21",
  watch: "2026-04-24",
  book: "2026-04-24",
  scorecard: "2026-04-24",
  about: "2026-04-24",
  playbook: "2026-04-24",
  privacy: "2026-04-06",
  terms: "2026-04-06",
};

export default function sitemap() {
  const baseUrl = "https://modernbizops.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(LAST_MODIFIED.home),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/watch`,
      lastModified: new Date(LAST_MODIFIED.watch),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: new Date(LAST_MODIFIED.book),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/scorecard`,
      lastModified: new Date(LAST_MODIFIED.scorecard),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(LAST_MODIFIED.about),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/playbook`,
      lastModified: new Date(LAST_MODIFIED.playbook),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(LAST_MODIFIED.privacy),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(LAST_MODIFIED.terms),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}

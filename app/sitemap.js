// Fixed lastModified dates so search engines get stable change-frequency
// signals instead of "everything changed on every build". Update these
// manually when a page's content actually changes.

const LAST_MODIFIED = {
  home: "2026-04-21",
  watch: "2026-04-24",
  book: "2026-04-24",
  scorecard: "2026-04-24",
  about: "2026-04-24",
  playbook: "2026-06-03",
  maturityModel: "2026-07-02",
  privacy: "2026-04-06",
  terms: "2026-04-06",
  learnStage1Reactive: "2026-07-14",
  learnCrmArchitecture: "2026-07-14",
  learnPipelineStageDesign: "2026-07-14",
  learnIdealCustomerProfile: "2026-07-14",
  learnRevenueLifecycleDesign: "2026-07-14",
  learnDataQualityManagement: "2026-07-14",
  learnLeadQualificationFramework: "2026-07-14",
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
      url: `${baseUrl}/predictable-revenue-engine`,
      lastModified: new Date(LAST_MODIFIED.maturityModel),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learn/revenue-operations-maturity-stage-1-reactive`,
      lastModified: new Date(LAST_MODIFIED.learnStage1Reactive),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/crm-architecture-and-governance`,
      lastModified: new Date(LAST_MODIFIED.learnCrmArchitecture),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/pipeline-stage-design`,
      lastModified: new Date(LAST_MODIFIED.learnPipelineStageDesign),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/ideal-customer-profile`,
      lastModified: new Date(LAST_MODIFIED.learnIdealCustomerProfile),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/revenue-lifecycle-design`,
      lastModified: new Date(LAST_MODIFIED.learnRevenueLifecycleDesign),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/data-quality-management`,
      lastModified: new Date(LAST_MODIFIED.learnDataQualityManagement),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/lead-qualification-framework`,
      lastModified: new Date(LAST_MODIFIED.learnLeadQualificationFramework),
      changeFrequency: "monthly",
      priority: 0.7,
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

// Fixed lastModified dates so search engines get stable change-frequency
// signals instead of "everything changed on every build". Update these
// manually when a page's content actually changes.

const LAST_MODIFIED = {
  home: "2026-08-11",
  watch: "2026-04-24",
  scorecard: "2026-04-24",
  about: "2026-04-24",
  maturityModel: "2026-07-02",
  aiReadinessAssessment: "2026-08-11",
  aiAutomationServices: "2026-08-11",
  pricing: "2026-08-11",
  foundingClients: "2026-08-11",
  revenueOperationsConsulting: "2026-07-21",
  learnIndex: "2026-08-11",
  privacy: "2026-04-06",
  terms: "2026-04-06",
  learnStage1Reactive: "2026-07-14",
  learnCrmArchitecture: "2026-07-14",
  learnPipelineStageDesign: "2026-07-14",
  learnIdealCustomerProfile: "2026-07-14",
  learnRevenueLifecycleDesign: "2026-07-14",
  learnDataQualityManagement: "2026-07-14",
  learnLeadQualificationFramework: "2026-07-14",
  learnFractionalCoo: "2026-07-14",
  learnNetRevenueRetention: "2026-07-14",
  learnMarketingAndSalesAlignment: "2026-07-14",
  learnWhatIsRevops: "2026-07-15",
  learnRevenuePerEmployee: "2026-07-15",
  learnSmarketing: "2026-07-15",
  learnMqlToSqlConversionRate: "2026-07-15",
  learnInvoluntaryChurn: "2026-07-15",
  learnWinLossAnalysis: "2026-07-15",
  learnFractionalCooCost: "2026-07-22",
  learnAiForSmallBusiness: "2026-07-22",
  learnAiToolsForSmallBusiness: "2026-07-22",
  aiConsultingForSmallBusiness: "2026-07-22",
  learnCustomerRetentionStrategy: "2026-07-23",
  learnReduceCustomerChurn: "2026-07-23",
  learnPaymentRecovery: "2026-07-23",
  learnCustomerLifecycleMarketing: "2026-07-23",
  learnConversionRateOptimization: "2026-07-23",
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
      url: `${baseUrl}/scorecard`,
      lastModified: new Date(LAST_MODIFIED.scorecard),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      // The money door. Every other surface walks a buyer here, so it outranks
      // the two pages that support it.
      url: `${baseUrl}/ai-readiness-assessment`,
      lastModified: new Date(LAST_MODIFIED.aiReadinessAssessment),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-automation-services`,
      lastModified: new Date(LAST_MODIFIED.aiAutomationServices),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(LAST_MODIFIED.pricing),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      // The founding client hand-raise. Below the three offer pages because it
      // converts a reader who has already priced the work, and it is the
      // destination for build-in-public content rather than a search entry.
      url: `${baseUrl}/founding-clients`,
      lastModified: new Date(LAST_MODIFIED.foundingClients),
      changeFrequency: "monthly",
      priority: 0.7,
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
      url: `${baseUrl}/revenue-operations-consulting`,
      lastModified: new Date(LAST_MODIFIED.revenueOperationsConsulting),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      // Root-level, off-nav BOFU service page. Off-nav means no header/footer
      // link, but it is still a canonical, indexable URL, so it belongs in the
      // sitemap. A notch below the primary consulting page.
      url: `${baseUrl}/ai-consulting-for-small-business`,
      lastModified: new Date(LAST_MODIFIED.aiConsultingForSmallBusiness),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      // The library index. It ships with the nav restructure that gave "Learn"
      // a real destination, and it is the internal hub the twenty-four pages
      // below now hang off.
      url: `${baseUrl}/learn`,
      lastModified: new Date(LAST_MODIFIED.learnIndex),
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
      url: `${baseUrl}/learn/fractional-coo`,
      lastModified: new Date(LAST_MODIFIED.learnFractionalCoo),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/net-revenue-retention`,
      lastModified: new Date(LAST_MODIFIED.learnNetRevenueRetention),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/marketing-and-sales-alignment`,
      lastModified: new Date(LAST_MODIFIED.learnMarketingAndSalesAlignment),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/what-is-revops`,
      lastModified: new Date(LAST_MODIFIED.learnWhatIsRevops),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/revenue-per-employee`,
      lastModified: new Date(LAST_MODIFIED.learnRevenuePerEmployee),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/smarketing`,
      lastModified: new Date(LAST_MODIFIED.learnSmarketing),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/mql-to-sql-conversion-rate`,
      lastModified: new Date(LAST_MODIFIED.learnMqlToSqlConversionRate),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/involuntary-churn`,
      lastModified: new Date(LAST_MODIFIED.learnInvoluntaryChurn),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/win-loss-analysis`,
      lastModified: new Date(LAST_MODIFIED.learnWinLossAnalysis),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/fractional-coo-cost`,
      lastModified: new Date(LAST_MODIFIED.learnFractionalCooCost),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/ai-for-small-business`,
      lastModified: new Date(LAST_MODIFIED.learnAiForSmallBusiness),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/ai-tools-for-small-business`,
      lastModified: new Date(LAST_MODIFIED.learnAiToolsForSmallBusiness),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/customer-retention-strategy`,
      lastModified: new Date(LAST_MODIFIED.learnCustomerRetentionStrategy),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/reduce-customer-churn`,
      lastModified: new Date(LAST_MODIFIED.learnReduceCustomerChurn),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/payment-recovery`,
      lastModified: new Date(LAST_MODIFIED.learnPaymentRecovery),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/customer-lifecycle-marketing`,
      lastModified: new Date(LAST_MODIFIED.learnCustomerLifecycleMarketing),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/conversion-rate-optimization`,
      lastModified: new Date(LAST_MODIFIED.learnConversionRateOptimization),
      changeFrequency: "monthly",
      priority: 0.7,
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

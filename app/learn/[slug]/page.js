import { notFound } from "next/navigation";
import { LEARN_PAGES } from "@/lib/learn/registry";
import LearnPageShell from "@/components/learn/LearnPageShell";
import Stage1ReactiveHubBody from "@/components/learn/content/Stage1ReactiveHubBody";
import CrmArchitectureGovernanceBody from "@/components/learn/content/CrmArchitectureGovernanceBody";
import PipelineStageDesignBody from "@/components/learn/content/PipelineStageDesignBody";
import IdealCustomerProfileBody from "@/components/learn/content/IdealCustomerProfileBody";
import RevenueLifecycleDesignBody from "@/components/learn/content/RevenueLifecycleDesignBody";
import DataQualityManagementBody from "@/components/learn/content/DataQualityManagementBody";
import LeadQualificationFrameworkBody from "@/components/learn/content/LeadQualificationFrameworkBody";
import FractionalCooBody from "@/components/learn/content/FractionalCooBody";
import NetRevenueRetentionBody from "@/components/learn/content/NetRevenueRetentionBody";
import MarketingAndSalesAlignmentBody from "@/components/learn/content/MarketingAndSalesAlignmentBody";
import WhatIsRevOpsBody from "@/components/learn/content/WhatIsRevOpsBody";
import RevenuePerEmployeeBody from "@/components/learn/content/RevenuePerEmployeeBody";
import SmarketingBody from "@/components/learn/content/SmarketingBody";
import MqlToSqlConversionRateBody from "@/components/learn/content/MqlToSqlConversionRateBody";
import InvoluntaryChurnBody from "@/components/learn/content/InvoluntaryChurnBody";
import WinLossAnalysisBody from "@/components/learn/content/WinLossAnalysisBody";
import FractionalCooCostBody from "@/components/learn/content/FractionalCooCostBody";
import AiForSmallBusinessBody from "@/components/learn/content/AiForSmallBusinessBody";
import AiToolsForSmallBusinessBody from "@/components/learn/content/AiToolsForSmallBusinessBody";
import CustomerRetentionStrategyBody from "@/components/learn/content/CustomerRetentionStrategyBody";
import ReduceCustomerChurnBody from "@/components/learn/content/ReduceCustomerChurnBody";
import PaymentRecoveryBody from "@/components/learn/content/PaymentRecoveryBody";
import CustomerLifecycleMarketingBody from "@/components/learn/content/CustomerLifecycleMarketingBody";
import ConversionRateOptimizationBody from "@/components/learn/content/ConversionRateOptimizationBody";
import AiAutomationAgencyCostBody from "@/components/learn/content/AiAutomationAgencyCostBody";
import AiConsultantVsInHouseBody from "@/components/learn/content/AiConsultantVsInHouseBody";
import BestAiAutomationAgenciesBody from "@/components/learn/content/BestAiAutomationAgenciesBody";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getLearnPersonSchema,
  getDefinedTermSetSchema,
  getDefinedTermSchema,
  getArticleSchema,
} from "@/lib/learn/schema";

const BODIES = {
  "revenue-operations-maturity-stage-1-reactive": Stage1ReactiveHubBody,
  "crm-architecture-and-governance": CrmArchitectureGovernanceBody,
  "pipeline-stage-design": PipelineStageDesignBody,
  "ideal-customer-profile": IdealCustomerProfileBody,
  "revenue-lifecycle-design": RevenueLifecycleDesignBody,
  "data-quality-management": DataQualityManagementBody,
  "lead-qualification-framework": LeadQualificationFrameworkBody,
  "fractional-coo": FractionalCooBody,
  "net-revenue-retention": NetRevenueRetentionBody,
  "marketing-and-sales-alignment": MarketingAndSalesAlignmentBody,
  "what-is-revops": WhatIsRevOpsBody,
  "revenue-per-employee": RevenuePerEmployeeBody,
  "smarketing": SmarketingBody,
  "mql-to-sql-conversion-rate": MqlToSqlConversionRateBody,
  "involuntary-churn": InvoluntaryChurnBody,
  "win-loss-analysis": WinLossAnalysisBody,
  "fractional-coo-cost": FractionalCooCostBody,
  "ai-for-small-business": AiForSmallBusinessBody,
  "ai-tools-for-small-business": AiToolsForSmallBusinessBody,
  "customer-retention-strategy": CustomerRetentionStrategyBody,
  "reduce-customer-churn": ReduceCustomerChurnBody,
  "payment-recovery": PaymentRecoveryBody,
  "customer-lifecycle-marketing": CustomerLifecycleMarketingBody,
  "conversion-rate-optimization": ConversionRateOptimizationBody,
  "ai-automation-agency-cost": AiAutomationAgencyCostBody,
  "ai-consultant-vs-in-house": AiConsultantVsInHouseBody,
  "best-ai-automation-agencies-b2b": BestAiAutomationAgenciesBody,
};

// hub -> DefinedTermSet; competency -> DefinedTerm (standalone when the entry
// has no inDefinedTermSetUrl); article (pillar-map pages) -> Article.
function getTypeSchema(entry) {
  if (entry.pageType === "hub") return getDefinedTermSetSchema(entry);
  if (entry.pageType === "article") return getArticleSchema(entry);
  return getDefinedTermSchema(entry);
}

export function generateStaticParams() {
  return Object.keys(LEARN_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = LEARN_PAGES[slug];
  if (!entry) return {};
  return {
    // `absolute` opts /learn pages out of the root " | Modern BizOps" title
    // template in app/layout.js. The suffix cost 16 characters and pushed most
    // of these titles past Google's roughly 60-character truncation point.
    // Note for anyone comparing this against the drafting files under
    // Marketing Systems/SEO Pilot/published/: a rendered title is the registry
    // entry PLUS whatever template applies. The suffix appears in none of those
    // files, which is why the truncation went unnoticed for three weeks. The
    // rest of the site keeps the template deliberately.
    title: { absolute: entry.title },
    description: entry.metaDescription,
    alternates: { canonical: entry.url },
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: entry.url,
      images: [{ url: entry.ogImage, width: 1200, height: 630, alt: entry.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.metaDescription,
      images: [entry.ogImage],
    },
  };
}

export default async function LearnPage({ params }) {
  const { slug } = await params;
  const entry = LEARN_PAGES[slug];
  if (!entry) notFound();

  const Body = BODIES[slug];
  const schemas = [
    getTypeSchema(entry),
    getBreadcrumbSchema(entry),
    getFaqSchema(entry),
    getLearnPersonSchema(),
  ];

  return (
    <>
      <LearnPageShell entry={entry}>
        <Body />
      </LearnPageShell>
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

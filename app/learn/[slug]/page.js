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
    title: entry.title,
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

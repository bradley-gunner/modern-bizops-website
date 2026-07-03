import { STAGE_1 } from "./stage1";
import { STAGE_2 } from "./stage2";
import { STAGE_3 } from "./stage3";
import { STAGE_4 } from "./stage4";

export const COMPETENCIES = [...STAGE_1, ...STAGE_2, ...STAGE_3, ...STAGE_4];

export function competenciesForStage(n) {
  return COMPETENCIES.filter((c) => c.stage === n).sort((a, b) => a.id - b.id);
}

export function competencyBySlug(slug) {
  return COMPETENCIES.find((c) => c.slug === slug);
}

// The four competencies that apply only to certain business models. Rendered
// under an "Applies to your business model" group, split out from the core set.
export const MODEL_SPECIFIC_SLUGS = [
  "customer-lifecycle-marketing-automation",
  "subscription-mrr-operations",
  "conversion-rate-optimization",
  "product-usage-analytics",
];

export function isModelSpecific(c) {
  return MODEL_SPECIFIC_SLUGS.includes(c.slug);
}

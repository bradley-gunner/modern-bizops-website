import { STAGE_1 } from "./stage1";
import { STAGE_2 } from "./stage2";
import { STAGE_3 } from "./stage3";
import { STAGE_4 } from "./stage4";

export const COMPETENCIES = [...STAGE_1, ...STAGE_2, ...STAGE_3, ...STAGE_4];

export function competenciesForStage(n) {
  return COMPETENCIES.filter((c) => c.stage === n);
}

export function competencyBySlug(slug) {
  return COMPETENCIES.find((c) => c.slug === slug);
}

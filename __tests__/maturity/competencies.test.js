import { describe, it, expect } from "vitest";
import {
  COMPETENCIES,
  competencyBySlug,
  MODEL_SPECIFIC_SLUGS,
  isModelSpecific,
} from "@/lib/maturity/competencies";
import { STAGES } from "@/lib/maturity/stages";

const EM_DASH = /—/;

describe("maturity competency data", () => {
  it("every competency has the required shape", () => {
    for (const c of COMPETENCIES) {
      expect(typeof c.id).toBe("number");
      expect(c.slug).toMatch(/^[a-z0-9-]+$/);
      expect([1, 2, 3, 4]).toContain(c.stage);
      expect(c.name.length).toBeGreaterThan(0);
      expect(c.shortDef.length).toBeGreaterThan(0);
      expect(c.definition.length).toBeGreaterThan(0);
      expect(Array.isArray(c.data.tools)).toBe(true);
      expect(c.data.tools.length).toBeGreaterThan(0);
      expect(c.data.points.length).toBeGreaterThan(0);
      expect(c.questions.ask.length).toBeGreaterThan(0);
      expect(c.questions.listenFor.length).toBeGreaterThan(0);
    }
  });

  it("never exposes a scoring rubric", () => {
    for (const c of COMPETENCIES) {
      expect(c).not.toHaveProperty("rubric");
    }
  });

  it("contains no em dashes", () => {
    const blob = JSON.stringify(COMPETENCIES);
    expect(EM_DASH.test(blob)).toBe(false);
  });

  it("has unique slugs and ids", () => {
    const slugs = COMPETENCIES.map((c) => c.slug);
    const ids = COMPETENCIES.map((c) => c.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves a competency by slug", () => {
    expect(competencyBySlug("pipeline-stage-design")?.name).toBe(
      "Pipeline Stage Design"
    );
  });

  it("has all 44 competencies", () => {
    expect(COMPETENCIES.length).toBe(44);
  });

  it("every stage has at least one competency and matches STAGES", () => {
    const stageNums = new Set(COMPETENCIES.map((c) => c.stage));
    for (const s of STAGES) expect(stageNums.has(s.n)).toBe(true);
  });

  it("flags the four model-specific competencies", () => {
    const flagged = COMPETENCIES.filter(isModelSpecific);
    expect(flagged.length).toBe(MODEL_SPECIFIC_SLUGS.length);
    for (const slug of MODEL_SPECIFIC_SLUGS) {
      expect(competencyBySlug(slug)).toBeTruthy();
    }
  });

  it("CRM Architecture and Pipeline Stage Design point at their live /learn pages, nothing else does", () => {
    const withLearnMoreUrl = COMPETENCIES.filter((c) => c.learnMoreUrl);
    expect(withLearnMoreUrl.map((c) => c.slug).sort()).toEqual(
      ["crm-architecture-governance", "pipeline-stage-design"].sort()
    );
    expect(competencyBySlug("crm-architecture-governance").learnMoreUrl).toBe(
      "/learn/crm-architecture-and-governance"
    );
    expect(competencyBySlug("pipeline-stage-design").learnMoreUrl).toBe(
      "/learn/pipeline-stage-design"
    );
  });
});

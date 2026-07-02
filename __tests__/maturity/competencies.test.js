import { describe, it, expect } from "vitest";
import { COMPETENCIES, competencyBySlug } from "@/lib/maturity/competencies";

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
});

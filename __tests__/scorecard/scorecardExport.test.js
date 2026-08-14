import { describe, it, expect } from 'vitest';
import { buildResult } from '@/lib/scorecard/resultRender';
import { buildScorecardExport, answeredQuestions } from '@/lib/scorecard/scorecardExport';

function answers() {
  return {
    q1: { value: '5m_15m', exact: 8_000_000 },
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '51_75' },
    q4: { value: 'D', score: 4 },
    q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 }, q7: { value: 'B', score: 2 },
    q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 }, q10: { value: 'C', score: 3 },
    q11: { value: 'A', score: 1 }, q12: { value: 'B', score: 2 }, q13: { value: 'C', score: 3 },
    q14: { value: '25k_100k' }, q15: { value: 'over_180' }, q16: { value: 'over_30' },
  };
}

const GENERATED_AT = '2026-08-14T12:00:00.000Z';

describe('answeredQuestions', () => {
  it('serializes the questions the prospect saw, with 1..5 scores and exact figures', () => {
    const qs = answeredQuestions(answers());
    expect(qs).toHaveLength(16);
    const q5 = qs.find((q) => q.id === 'q5');
    expect(q5.answer).toBe('We tried a tool or two, but they did not stick.');
    expect(q5.score).toBe(2);
    expect(q5.dimension).toBe('strategy');
    const q1 = qs.find((q) => q.id === 'q1');
    expect(q1.exact).toBe(8_000_000);
  });

  it('excludes the churn question for models where it is hidden', () => {
    const a = { ...answers(), q2: { value: 'ECOMMERCE' } };
    expect(answeredQuestions(a).find((q) => q.id === 'q16')).toBeUndefined();
  });
});

describe('buildScorecardExport', () => {
  const result = buildResult(answers(), { generatedAt: GENERATED_AT });
  const exported = buildScorecardExport(result, answers(), { firstName: 'Jane', company: 'Acme' });

  it('carries the readiness read: band, composite, dimensions, flags', () => {
    expect(exported.readiness.band).toBe('Foundations First');
    expect(exported.readiness.composite).toBe(2.0);
    expect(exported.readiness.dimensions.map((d) => d.key)).toEqual(['strategy', 'people', 'governance']);
    expect(exported.readiness.burnedAttempt).toBe(true);
    expect(exported.readiness.beliefConfidence).toBe(4);
    expect(exported.readiness.connectComfort).toBe(3);
  });

  it('serializes the menu-shaped opportunity map with verdicts and bases', () => {
    expect(exported.opportunityMap.length).toBe(6);
    for (const row of exported.opportunityMap) {
      expect(row.verdict.state, row.area).toMatch(/^(ready|blocked|audit)$/);
      expect(row.verdict.basis, row.area).toBeTruthy();
    }
    const speedToLead = exported.opportunityMap.find((r) => r.area === 'speedToLead');
    expect(speedToLead.dollarImpact).toBeNull();
    expect(speedToLead.kind).toBe('evidence');
  });

  it('keeps the dollar-gap range, the sections, and the survivable JSON round trip', () => {
    expect(exported.dollarGap.high).toBeGreaterThan(0);
    expect(exported.whyItDidNotStick).toMatch(/You told us/);
    expect(exported.beliefContrast).toMatch(/That is a belief/);
    expect(exported.firstMove.text).toBeTruthy();
    expect(exported.meta.firstName).toBe('Jane');
    expect(exported.businessModel.key).toBe('PROFESSIONAL_SERVICES');
    expect(exported.benchmarkVersion).toBe('1.2');
    expect(() => JSON.parse(JSON.stringify(exported))).not.toThrow();
  });

  it('serializes observed findings when a URL was given, null otherwise', () => {
    expect(exported.observed).toBeNull();
    const withObserved = buildResult(answers(), {
      generatedAt: GENERATED_AT,
      observed: {
        url: 'https://example.com/', host: 'example.com', status: 'ok', pageRead: true,
        analytics: { checked: true, ga4: true, gtm: false },
        adPixels: { checked: true, names: [] },
        social: { checked: true, platforms: [] },
        schema: { checked: true, types: ['Organization'] },
        emailAuth: { checked: true, domain: 'example.com', spf: true, dmarc: false, dkim: null, missing: ['no DMARC record'] },
        freshness: { checked: false, lastPublished: null, source: null },
      },
    });
    const exp2 = buildScorecardExport(withObserved, answers(), {});
    expect(exp2.observed.host).toBe('example.com');
    expect(exp2.observed.findings.length).toBeGreaterThan(0);
  });
});

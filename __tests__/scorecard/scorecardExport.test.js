import { describe, it, expect } from 'vitest';
import { buildResult } from '@/lib/scorecard/resultRender';
import { buildScorecardExport, answeredQuestions } from '@/lib/scorecard/scorecardExport';
import { getQuestionsFor } from '@/lib/scorecard/questions';

function answers() {
  return {
    q1: { value: '7m_15m' },
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '51_75' },
    q4: { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
    q7: { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
    q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
    q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
  };
}

describe('answeredQuestions', () => {
  it('returns every visible question in order with chosen label + score', () => {
    const a = answers();
    const qs = answeredQuestions(a);
    expect(qs.map((q) => q.id)).toEqual(getQuestionsFor(a).map((q) => q.id));
    // q2 is a segmentation question: label resolved, no score.
    const q2 = qs.find((q) => q.id === 'q2');
    expect(q2.answer).toBe('Professional services');
    expect(q2.score).toBeNull();
    // q4 is a maturity question: chosen label + 1..4 score + competency.
    const q4 = qs.find((q) => q.id === 'q4');
    expect(q4.score).toBe(1);
    expect(q4.competencyLabel).toBe('CRM architecture');
    expect(q4.answer).toMatch(/no CRM/i);
  });

  it('excludes q15 for models where churn is hidden', () => {
    const a = { ...answers(), q2: { value: 'ECOMMERCE' } };
    delete a.q15;
    expect(answeredQuestions(a).some((q) => q.id === 'q15')).toBe(false);
  });
});

describe('buildScorecardExport', () => {
  it('assembles the complete result with all spec-required sections', () => {
    const a = answers();
    const result = buildResult(a, { generatedAt: '2026-07-24T12:00:00.000Z' });
    const exp = buildScorecardExport(result, a, { firstName: 'Jane', company: 'Acme' });

    expect(exp.meta).toEqual({ firstName: 'Jane', company: 'Acme', generatedAt: '2026-07-24T12:00:00.000Z' });
    expect(exp.businessModel).toEqual({ key: 'PROFESSIONAL_SERVICES', label: 'professional services' });

    // Profile bands.
    expect(exp.profile.revenueBand).toEqual({ value: '7m_15m', label: '$7M to $15M' });
    expect(exp.profile.teamSize.label).toBe('51 to 75');
    expect(exp.profile.averageDealValue.label).toBe('$25K to $100K');

    // 15 Q&A.
    expect(exp.questions.length).toBe(getQuestionsFor(a).length);

    // Dollar-gap range with conservative + peer-median reads.
    expect(exp.dollarGap.low).toBe(Math.round(result.headline.floorDollars));
    expect(exp.dollarGap.high).toBe(Math.round(result.headline.medianDollars));
    expect(exp.dollarGap.conservativeRead).toMatch(/^\$/);
    expect(exp.dollarGap.peerMedianRead).toMatch(/^\$/);

    // Maturity stage detail.
    expect(exp.maturityStage.number).toBe(result.placement.stage);
    expect(exp.maturityStage.label).toBe(result.placement.name);
    expect(exp.maturityStage.description).toBe(result.placement.descriptor);
    expect(Array.isArray(exp.maturityStage.crossingIntoNext.criteria)).toBe(true);

    // Metrics: your number / peer median / peer range / read / dollar impact /
    // how-to-close / source. At least one surfaced metric carries a dollar
    // impact and how-to-close prose.
    expect(exp.metrics.length).toBeGreaterThan(0);
    const withImpact = exp.metrics.find((m) => m.dollarImpact);
    expect(withImpact.yourNumber).toBeTruthy();
    expect(withImpact.peerMedian).toBeTruthy();
    expect(withImpact.peerRange).toBeTruthy();
    expect(withImpact.read).toBeTruthy();
    expect(withImpact.source).toBeTruthy();
    expect(typeof withImpact.howToClose).toBe('string');
    expect(withImpact.howToClose.length).toBeGreaterThan(0);

    // Top gap + competency map.
    expect(typeof exp.topGap).toBe('string');
    expect(exp.competencyMap.length).toBe(9);
    expect(exp.competencyMap[0]).toHaveProperty('score');

    // The "how to close" string in the export matches the on-screen ROI fix.
    const topRoi = result.roiLines[0];
    const matching = exp.metrics.find((m) => m.key === topRoi.key);
    expect(matching.howToClose).toBe(topRoi.fix);
  });
});

import { describe, it, expect } from 'vitest';
import {
  QUESTIONS,
  BUSINESS_MODEL_OPTIONS,
  DIMENSIONS,
  BURNED_ATTEMPT_QUESTION,
  BURNED_ATTEMPT_VALUE,
  getQuestionsFor,
  isBurnedAttempt,
  resolveInput,
} from '@/lib/scorecard/questions';

describe('questions data (doc 15 Part 4)', () => {
  it('exports 16 questions, q1 through q16', () => {
    expect(QUESTIONS).toHaveLength(16);
    expect(QUESTIONS.map((q) => q.id)).toEqual([
      'q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15','q16',
    ]);
  });

  it('q1 through q3 are segmentation, unchanged bands', () => {
    for (const id of ['q1','q2','q3']) {
      expect(QUESTIONS.find((q) => q.id === id).kind).toBe('segmentation');
    }
    const q1 = QUESTIONS.find((q) => q.id === 'q1');
    expect(q1.options.map((o) => o.value)).toEqual([
      'under_1m','1m_3m','3m_5m','5m_15m','15m_50m','50m_plus',
    ]);
    expect(q1.options.map((o) => o.midpoint)).toEqual([
      750_000, 2_000_000, 4_000_000, 10_000_000, 32_500_000, 65_000_000,
    ]);
  });

  it('q4 is the belief probe: diagnostic, scored, flagged, NOT in a dimension', () => {
    const q4 = QUESTIONS.find((q) => q.id === 'q4');
    expect(q4.kind).toBe('diagnostic');
    expect(q4.belief).toBe(true);
    expect(q4.dimension).toBeUndefined();
    expect(q4.prompt).toMatch(/How confident are you that your CRM data/);
  });

  it('q5 through q13 are diagnostic with five options scored 1..5', () => {
    for (let i = 4; i <= 13; i++) {
      const q = QUESTIONS.find((x) => x.id === `q${i}`);
      expect(q.kind, q.id).toBe('diagnostic');
      expect(q.options, q.id).toHaveLength(5);
      expect(q.options.map((o) => o.score), q.id).toEqual([1, 2, 3, 4, 5]);
      expect(q.options.map((o) => o.value), q.id).toEqual(['A', 'B', 'C', 'D', 'E']);
    }
  });

  it('the three dimensions map three questions each', () => {
    expect(DIMENSIONS.map((d) => d.key)).toEqual(['strategy', 'people', 'governance']);
    expect(DIMENSIONS.map((d) => d.label)).toEqual([
      'AI Strategy and Use-Case Alignment',
      'People and Adoption Readiness',
      'Governance and Trust',
    ]);
    for (const d of DIMENSIONS) {
      for (const id of d.ids) {
        expect(QUESTIONS.find((q) => q.id === id).dimension, id).toBe(d.key);
      }
    }
  });

  it('q5 option 2 is the burned-attempt flag, verbatim from doc 15', () => {
    expect(BURNED_ATTEMPT_QUESTION).toBe('q5');
    expect(BURNED_ATTEMPT_VALUE).toBe('B');
    const q5 = QUESTIONS.find((q) => q.id === 'q5');
    const opt = q5.options.find((o) => o.value === 'B');
    expect(opt.label).toBe('We tried a tool or two, but they did not stick.');
    expect(opt.score).toBe(2);
    expect(isBurnedAttempt({ q5: { value: 'B' } })).toBe(true);
  });

  it('answer options keep the respondent voice (the sanitizer exemption exists for a reason)', () => {
    // "Me, on top of everything else." would throw in sanitizeVoice; it is the
    // respondent speaking and must survive verbatim.
    const q8 = QUESTIONS.find((q) => q.id === 'q8');
    expect(q8.options[1].label).toBe('Me, on top of everything else.');
  });

  it('q14 through q16 are financial; q15 and q16 carry a notTracked option', () => {
    for (const id of ['q14','q15','q16']) {
      expect(QUESTIONS.find((q) => q.id === id).kind).toBe('financial');
    }
    expect(QUESTIONS.find((q) => q.id === 'q15').options.some((o) => o.notTracked)).toBe(true);
    expect(QUESTIONS.find((q) => q.id === 'q16').options.some((o) => o.notTracked)).toBe(true);
  });

  it('q16 (churn) is hidden when q2 = B2B_PRODUCT or ECOMMERCE', () => {
    expect(getQuestionsFor({ q2: { value: 'B2B_PRODUCT' } }).find((q) => q.id === 'q16')).toBeUndefined();
    expect(getQuestionsFor({ q2: { value: 'ECOMMERCE' } }).find((q) => q.id === 'q16')).toBeUndefined();
    expect(getQuestionsFor({ q2: { value: 'B2B_SAAS' } }).find((q) => q.id === 'q16')).toBeDefined();
  });

  it('shows 16 questions to recurring models and 15 to product/ecommerce (the landing count)', () => {
    expect(getQuestionsFor({ q2: { value: 'B2B_SAAS' } })).toHaveLength(16);
    expect(getQuestionsFor({ q2: { value: 'ECOMMERCE' } })).toHaveLength(15);
  });

  it('BUSINESS_MODEL_OPTIONS maps to the 8 benchmark enum values', () => {
    expect(BUSINESS_MODEL_OPTIONS.map((o) => o.value).sort()).toEqual([
      'B2B_PRODUCT','B2B_SAAS','B2C_SERVICES','B2C_SUBSCRIPTION','ECOMMERCE','MARKETPLACE','OTHER','PROFESSIONAL_SERVICES',
    ]);
  });

  it('no em-dash in any question prompt or option label', () => {
    const emDash = /—/;
    for (const q of QUESTIONS) {
      expect(q.prompt, q.id).not.toMatch(emDash);
      for (const opt of q.options) {
        expect(opt.label, `${q.id}.${opt.value}`).not.toMatch(emDash);
      }
    }
  });
});

describe('exact-figure entry (Bradley 2026-08-14, "Both")', () => {
  it('exists on exactly the five ROI-feeding inputs', () => {
    const withExact = QUESTIONS.filter((q) => q.exact).map((q) => q.id);
    expect(withExact).toEqual(['q1', 'q3', 'q14', 'q15', 'q16']);
  });

  it('resolveInput uses the band midpoint by default', () => {
    const r = resolveInput('q1', { q1: { value: '5m_15m' } });
    expect(r).toEqual({ value: 10_000_000, exact: false, notTracked: false });
  });

  it('an exact figure inside bounds replaces the midpoint and says so', () => {
    const r = resolveInput('q1', { q1: { value: '5m_15m', exact: 7_200_000 } });
    expect(r.value).toBe(7_200_000);
    expect(r.exact).toBe(true);
  });

  it('an exact figure outside the sanity bounds is ignored (negative control)', () => {
    const tooBig = resolveInput('q1', { q1: { value: '5m_15m', exact: 2_000_000_000 } });
    expect(tooBig.value).toBe(10_000_000);
    expect(tooBig.exact).toBe(false);
    const junk = resolveInput('q1', { q1: { value: '5m_15m', exact: NaN } });
    expect(junk.exact).toBe(false);
  });

  it('q16 exact churn is a ratio, bounded 0..1', () => {
    const ok = resolveInput('q16', { q16: { value: '5_15', exact: 0.18 } });
    expect(ok.value).toBe(0.18);
    expect(ok.exact).toBe(true);
    // 18 (a percent typed without conversion) is out of bounds and ignored.
    const raw = resolveInput('q16', { q16: { value: '5_15', exact: 18 } });
    expect(raw.value).toBe(0.10);
    expect(raw.exact).toBe(false);
  });

  it('notTracked surfaces through resolveInput', () => {
    const r = resolveInput('q15', { q15: { value: 'not_tracked' } });
    expect(r.notTracked).toBe(true);
    expect(r.value).toBeUndefined();
  });
});

import { describe, it, expect } from 'vitest';
import { QUESTIONS, BUSINESS_MODEL_OPTIONS, getQuestionsFor } from '@/lib/scorecard/questions';

describe('questions data', () => {
  it('exports 16 questions', () => {
    expect(QUESTIONS).toHaveLength(16);
  });

  it('question ids are q1 through q16', () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual([
      'q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15','q16',
    ]);
  });

  it('q1 through q3 are segmentation', () => {
    for (const id of ['q1','q2','q3']) {
      expect(QUESTIONS.find((q) => q.id === id).kind).toBe('segmentation');
    }
  });

  it('q4 through q12 are maturity with score 1..4 on every option', () => {
    for (let i = 4; i <= 12; i++) {
      const q = QUESTIONS.find((q) => q.id === `q${i}`);
      expect(q.kind).toBe('maturity');
      expect(q.options).toHaveLength(4);
      expect(q.options.map((o) => o.score)).toEqual([1, 2, 3, 4]);
    }
  });

  it('q13 through q15 are financial', () => {
    for (const id of ['q13','q14','q15']) {
      expect(QUESTIONS.find((q) => q.id === id).kind).toBe('financial');
    }
  });

  it('q14 and q15 carry a notTracked option', () => {
    const q14 = QUESTIONS.find((q) => q.id === 'q14');
    const q15 = QUESTIONS.find((q) => q.id === 'q15');
    expect(q14.options.some((o) => o.notTracked === true)).toBe(true);
    expect(q15.options.some((o) => o.notTracked === true)).toBe(true);
  });

  it('q15 is hidden when q2 = B2B_PRODUCT or ECOMMERCE', () => {
    expect(getQuestionsFor({ q2: { value: 'B2B_PRODUCT' } }).find((q) => q.id === 'q15')).toBeUndefined();
    expect(getQuestionsFor({ q2: { value: 'ECOMMERCE' } }).find((q) => q.id === 'q15')).toBeUndefined();
    expect(getQuestionsFor({ q2: { value: 'B2B_SAAS' } }).find((q) => q.id === 'q15')).toBeDefined();
  });

  it('every Section 2 question carries a non-empty peerAnchorTemplate string', () => {
    for (let i = 4; i <= 12; i++) {
      const q = QUESTIONS.find((q) => q.id === `q${i}`);
      expect(q.peerAnchorTemplate).toBeTypeOf('string');
      expect(q.peerAnchorTemplate.length).toBeGreaterThan(0);
    }
  });

  it('at least 5 of the 9 Section 2 questions interpolate {model_label}', () => {
    const interpolated = [];
    for (let i = 4; i <= 12; i++) {
      const q = QUESTIONS.find((q) => q.id === `q${i}`);
      if (/\{model_label\}/.test(q.peerAnchorTemplate)) interpolated.push(q.id);
    }
    expect(interpolated.length).toBeGreaterThanOrEqual(5);
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
      if (q.peerAnchorTemplate) expect(q.peerAnchorTemplate, q.id).not.toMatch(emDash);
      for (const opt of q.options) {
        expect(opt.label, `${q.id}.${opt.value}`).not.toMatch(emDash);
      }
    }
  });
});

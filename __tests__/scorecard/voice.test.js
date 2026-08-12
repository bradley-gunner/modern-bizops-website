import { describe, it, expect } from 'vitest';
import {
  sanitizeVoice,
  SECTION_LABELS,
  SECTION_SUBLINES,
  STAGE_NAMES,
  STAGE_DESCRIPTORS,
  COMPARISON_COPY,
  DISCLOSURE,
  CTA_LINES,
  CTA_HEADING,
  sourceCitation,
  formatUsd,
  bandTitle,
  BLOCK_NAMES,
  LEVEL_WORDS,
  NEXT_STAGE_CRITERIA,
  FIX_PARAGRAPHS,
  NO_GAP_HEADLINE,
  NO_GAP_BINDING,
  CTA_FOCUS_TEMPLATE,
  metricCitation,
} from '@/lib/scorecard/voice';

// sanitizeVoice was inverted on 2026-08-12. It threw on \b(we|our|us)\b until
// Bradley retired the first-person singular as a brand voice, at which point
// the sanitizer was throwing on the house voice itself. It now throws on the
// singular, and the plural is asserted to pass so a revert cannot land quietly.
describe('sanitizeVoice', () => {
  it('returns clean strings unchanged', () => {
    expect(sanitizeVoice('Your number is right here.')).toBe('Your number is right here.');
  });

  it('throws on em-dash', () => {
    expect(() => sanitizeVoice('this is—broken')).toThrow(/em-dash/);
  });

  it('throws on first-person singular I/my/me', () => {
    expect(() => sanitizeVoice('I built this')).toThrow(/first-person singular/);
    expect(() => sanitizeVoice('My roadmap')).toThrow(/first-person singular/);
    expect(() => sanitizeVoice('Tell me more')).toThrow(/first-person singular/);
    expect(() => sanitizeVoice('The judgment is mine')).toThrow(/first-person singular/);
    expect(() => sanitizeVoice('I ran it myself')).toThrow(/first-person singular/);
  });

  it('throws on the I contractions', () => {
    expect(() => sanitizeVoice("I'm on it")).toThrow(/first-person singular/);
    expect(() => sanitizeVoice("I've seen this")).toThrow(/first-person singular/);
  });

  it('ALLOWS the first-person plural, which is now the house voice', () => {
    expect(sanitizeVoice('We built this')).toBe('We built this');
    expect(sanitizeVoice('Our read of your stack')).toBe('Our read of your stack');
    expect(sanitizeVoice('Tell us more')).toBe('Tell us more');
  });

  it('does NOT flag "I" inside a word, or a lowercase i', () => {
    expect(() => sanitizeVoice('Involuntary churn is a billing problem')).not.toThrow();
    expect(() => sanitizeVoice('the ith item in the list')).not.toThrow();
  });

  it('does NOT flag "my" or "me" inside a word (myriad, metric, name, etc.)', () => {
    expect(() => sanitizeVoice('a metric named something')).not.toThrow();
  });

  it('passes through non-string inputs', () => {
    expect(sanitizeVoice(42)).toBe(42);
    expect(sanitizeVoice(null)).toBe(null);
  });
});

describe('static copy is clean and present', () => {
  it('SECTION_LABELS covers sections 1..3', () => {
    expect(SECTION_LABELS[1]).toBeTypeOf('string');
    expect(SECTION_LABELS[2]).toBeTypeOf('string');
    expect(SECTION_LABELS[3]).toBeTypeOf('string');
  });

  it('SECTION_SUBLINES covers sections 1..3 and has no em-dash', () => {
    for (const k of [1, 2, 3]) {
      expect(SECTION_SUBLINES[k]).toBeTypeOf('string');
      expect(SECTION_SUBLINES[k]).not.toMatch(/—/);
    }
  });

  it('Section 1 subline says "Three questions" not "Three taps"', () => {
    expect(SECTION_SUBLINES[1]).toMatch(/Three questions/);
    expect(SECTION_SUBLINES[1]).not.toMatch(/Three taps/);
  });

  it('STAGE_NAMES are Reactive, Repeatable, Predictable, Compounding', () => {
    expect(STAGE_NAMES[1]).toBe('Reactive');
    expect(STAGE_NAMES[2]).toBe('Repeatable');
    expect(STAGE_NAMES[3]).toBe('Predictable');
    expect(STAGE_NAMES[4]).toBe('Compounding');
  });

  it('STAGE_DESCRIPTORS cover stages 1..4 with no em-dash and no first-person singular', () => {
    for (const k of [1, 2, 3, 4]) {
      expect(STAGE_DESCRIPTORS[k]).toBeTypeOf('string');
      expect(STAGE_DESCRIPTORS[k]).not.toMatch(/—/);
      expect(STAGE_DESCRIPTORS[k]).not.toMatch(/\bI\b/);
      expect(STAGE_DESCRIPTORS[k]).not.toMatch(/\b(my|me|mine|myself)\b/i);
    }
  });

  it('COMPARISON_COPY covers all four generators in all three bands', () => {
    for (const key of ['salesCycle', 'retention', 'revenuePerEmployee', 'leadResponse']) {
      for (const band of ['meets', 'partial', 'fails']) {
        expect(COMPARISON_COPY[key][band]).toBeTypeOf('string');
      }
    }
  });

  it('DISCLOSURE and CTA copy are clean strings', () => {
    expect(DISCLOSURE).toBeTypeOf('string');
    expect(DISCLOSURE).not.toMatch(/—/);
    expect(CTA_HEADING).toBeTypeOf('string');
    expect(CTA_LINES).toHaveLength(4);
    for (const line of CTA_LINES) {
      expect(line).toBeTypeOf('string');
      expect(line).not.toMatch(/—/);
    }
  });
});

describe('sourceCitation', () => {
  it('emits the v1.2 footer with the model label', () => {
    expect(sourceCitation('B2B SaaS')).toBe('Source: businessModelBenchmarks v1.2, B2B SaaS row.');
  });
});

describe('formatUsd', () => {
  it('formats millions with one decimal', () => {
    expect(formatUsd(2_400_000)).toBe('$2.4M');
  });

  it('formats thousands as $XK rounded', () => {
    expect(formatUsd(150_000)).toBe('$150K');
    expect(formatUsd(15_500)).toBe('$16K');
  });

  it('formats values under $1K as dollars', () => {
    expect(formatUsd(750)).toBe('$750');
  });
});

describe('bandTitle', () => {
  it('returns the human-readable title for each generator key', () => {
    expect(bandTitle('revenuePerEmployee')).toBe('Revenue per employee gap');
    expect(bandTitle('salesCycle')).toBe('Sales cycle compression');
    expect(bandTitle('retention')).toBe('Retention gap');
    expect(bandTitle('leadResponse')).toBe('Lead response peer gap');
  });
});

describe('v1.1 statics', () => {
  it('BLOCK_NAMES has A, B, C client-facing labels', () => {
    expect(BLOCK_NAMES.A).toBe('Foundations');
    expect(BLOCK_NAMES.B).toBe('Operating discipline');
    expect(BLOCK_NAMES.C).toBe('Compound growth');
  });

  it('LEVEL_WORDS map score 1..4 to the heat-map dot label', () => {
    expect(LEVEL_WORDS[1]).toBe('Absent');
    expect(LEVEL_WORDS[2]).toBe('Informal');
    expect(LEVEL_WORDS[3]).toBe('Functional');
    expect(LEVEL_WORDS[4]).toBe('Managed');
  });

  it('NEXT_STAGE_CRITERIA covers next-stage transitions from 1, 2, 3', () => {
    for (const stage of [1, 2, 3]) {
      expect(NEXT_STAGE_CRITERIA[stage].name).toBeTypeOf('string');
      expect(Array.isArray(NEXT_STAGE_CRITERIA[stage].criteria)).toBe(true);
      expect(NEXT_STAGE_CRITERIA[stage].criteria.length).toBeGreaterThanOrEqual(2);
      for (const c of NEXT_STAGE_CRITERIA[stage].criteria) {
        expect(c).not.toMatch(/—/);
        expect(c).not.toMatch(/\bI\b/);
        expect(c).not.toMatch(/\b(my|me|mine|myself)\b/i);
      }
    }
  });

  it('NEXT_STAGE_CRITERIA[4] is undefined (no next stage)', () => {
    expect(NEXT_STAGE_CRITERIA[4]).toBeUndefined();
  });

  it('FIX_PARAGRAPHS covers each ROI generator key', () => {
    for (const key of ['revenuePerEmployee', 'salesCycle', 'retention', 'leadResponse']) {
      expect(FIX_PARAGRAPHS[key]).toBeTypeOf('string');
      expect(FIX_PARAGRAPHS[key].length).toBeGreaterThan(40);
      expect(FIX_PARAGRAPHS[key]).not.toMatch(/—/);
      expect(FIX_PARAGRAPHS[key]).not.toMatch(/\bI\b/);
      expect(FIX_PARAGRAPHS[key]).not.toMatch(/\b(my|me|mine|myself)\b/i);
    }
  });

  it('NO_GAP_HEADLINE and NO_GAP_BINDING render clean strings', () => {
    expect(NO_GAP_HEADLINE.lead).toBeTypeOf('string');
    expect(NO_GAP_HEADLINE.subline).toBeTypeOf('string');
    expect(NO_GAP_BINDING).toBeTypeOf('function');
    const out = NO_GAP_BINDING({ questions: [{ competencyLabel: 'CRM architecture' }] });
    expect(out).toMatch(/CRM architecture/);
    expect(out).not.toMatch(/dollar gaps above/);
  });

  it('NO_GAP_BINDING returns empty string when binding is null or empty', () => {
    expect(NO_GAP_BINDING(null)).toBe('');
    expect(NO_GAP_BINDING({ questions: [] })).toBe('');
  });

  it('NO_GAP_BINDING returns empty string when first competencyLabel is missing', () => {
    expect(NO_GAP_BINDING({ questions: [{ id: 'q4', score: 2 }] })).toBe('');
  });

  it('NO_GAP_BINDING with only one valid question still works', () => {
    const out = NO_GAP_BINDING({ questions: [{ competencyLabel: 'CRM architecture' }] });
    expect(out).toMatch(/CRM architecture/);
    expect(out).not.toMatch(/undefined/);
  });

  it('CTA_FOCUS_TEMPLATE interpolates the focus label', () => {
    expect(CTA_FOCUS_TEMPLATE('lead qualification')).toMatch(/lead qualification/);
    expect(CTA_FOCUS_TEMPLATE('lead qualification')).not.toMatch(/—/);
  });

  it('COMPARISON_COPY now keys on "retention" (renamed from nrr)', () => {
    expect(COMPARISON_COPY.retention).toBeDefined();
    expect(COMPARISON_COPY.retention.meets).toBeTypeOf('string');
    expect(COMPARISON_COPY.nrr).toBeUndefined();
  });

  it('bandTitle("retention") returns the Retention gap title', () => {
    expect(bandTitle('retention')).toBe('Retention gap');
  });
});

describe('metricCitation', () => {
  it('emits the named metric source with the asOf year', () => {
    const metric = { source: 'SaaS Capital 2025 Revenue per Employee Benchmarks (private SaaS, n=1000+)', asOf: 2025 };
    expect(metricCitation(metric)).toBe('Source: SaaS Capital 2025 Revenue per Employee Benchmarks (private SaaS, n=1000+) (2025).');
  });

  it('handles a metric without asOf', () => {
    expect(metricCitation({ source: 'Foo report' })).toBe('Source: Foo report.');
  });

  it('returns empty string when metric is null or undefined', () => {
    expect(metricCitation(null)).toBe('');
    expect(metricCitation(undefined)).toBe('');
  });

  it('returns empty string when metric.source is missing', () => {
    expect(metricCitation({ asOf: 2025 })).toBe('');
  });
});

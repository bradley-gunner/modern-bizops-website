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
} from '@/lib/scorecard/voice';

describe('sanitizeVoice', () => {
  it('returns clean strings unchanged', () => {
    expect(sanitizeVoice('Your number is right here.')).toBe('Your number is right here.');
  });

  it('throws on em-dash', () => {
    expect(() => sanitizeVoice('this is—broken')).toThrow(/em-dash/);
  });

  it('throws on first-person plural we/our/us', () => {
    expect(() => sanitizeVoice('we built this')).toThrow(/first-person plural/);
    expect(() => sanitizeVoice('Our roadmap')).toThrow(/first-person plural/);
    expect(() => sanitizeVoice('Tell us more')).toThrow(/first-person plural/);
  });

  it('does NOT flag "us" inside a word (business, usually, status, etc.)', () => {
    expect(() => sanitizeVoice('business as usual status')).not.toThrow();
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

  it('STAGE_NAMES are Reactive, Repeatable, Predictable, Compounding', () => {
    expect(STAGE_NAMES[1]).toBe('Reactive');
    expect(STAGE_NAMES[2]).toBe('Repeatable');
    expect(STAGE_NAMES[3]).toBe('Predictable');
    expect(STAGE_NAMES[4]).toBe('Compounding');
  });

  it('STAGE_DESCRIPTORS cover stages 1..4 with no em-dash and no first-person plural', () => {
    for (const k of [1, 2, 3, 4]) {
      expect(STAGE_DESCRIPTORS[k]).toBeTypeOf('string');
      expect(STAGE_DESCRIPTORS[k]).not.toMatch(/—/);
      expect(STAGE_DESCRIPTORS[k]).not.toMatch(/\b(we|our|us)\b/i);
    }
  });

  it('COMPARISON_COPY covers all four generators in all three bands', () => {
    for (const key of ['salesCycle', 'nrr', 'revenuePerEmployee', 'leadResponse']) {
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
    expect(bandTitle('nrr')).toBe('Retention gap');
    expect(bandTitle('leadResponse')).toBe('Lead response peer gap');
  });
});

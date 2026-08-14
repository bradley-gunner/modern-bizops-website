import { describe, it, expect } from 'vitest';
import {
  sanitizeVoice,
  SECTION_LABELS,
  SECTION_SUBLINES,
  BAND_DESCRIPTORS,
  BAND_EYEBROW,
  bandMarker,
  whyItDidNotStick,
  beliefContrast,
  OBSERVED_MARKER,
  OBSERVED_BOUNDARY,
  OBSERVED_UNREACHABLE,
  OBSERVED_LINES,
  LEVEL_WORDS,
  dimensionRead,
  SELF_REPORTED_MARKER,
  AREA_TITLES,
  COMPARISON_COPY,
  OPPORTUNITY_INTRO,
  VERDICT_LABELS,
  NO_GAP_ROW_LINE,
  NOT_TRACKED_ROW_LINE,
  NO_GAP_HEADLINE,
  fmtResponseDays,
  speedToLeadBody,
  deadLeadBody,
  DEAD_LEAD_BODY_GENERIC,
  INVOICE_COLLECTION_BODY,
  provenancePhrase,
  MATH_LINES,
  CAP_NOTE,
  FIRST_MOVES,
  pickFirstMoveKey,
  COMPUTED_DIMENSIONS,
  COMPUTED_DIMENSIONS_INTRO,
  DISCLOSURE,
  CTA_HEADING,
  CTA_LINES,
  FOUNDING_LINE,
  FOUNDING_LINK_LABEL,
  RESULT_HEADINGS,
  sourceCitation,
  formatUsd,
  metricCitation,
  FIX_PARAGRAPHS,
  bandTitle,
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

  it('ALLOWS the first-person plural, which is the house voice', () => {
    expect(sanitizeVoice('We built this')).toBe('We built this');
    expect(sanitizeVoice('Our read of your stack')).toBe('Our read of your stack');
    expect(sanitizeVoice('Tell us more')).toBe('Tell us more');
  });

  it('does NOT flag "I" inside a word, or a lowercase i', () => {
    expect(() => sanitizeVoice('Involuntary churn is a billing problem')).not.toThrow();
    expect(() => sanitizeVoice('the ith item in the list')).not.toThrow();
  });

  it('passes through non-string inputs', () => {
    expect(sanitizeVoice(42)).toBe(42);
    expect(sanitizeVoice(null)).toBe(null);
  });
});

// The claim boundary (doc 15 Part 3) is binding on every word of the result:
// no competency counts anywhere in Scan copy, no calibration claims on bands,
// connection language belongs to the audit alone.
describe('the claim boundary', () => {
  const ALL_SCAN_STRINGS = [
    ...Object.values(BAND_DESCRIPTORS),
    ...CTA_LINES,
    DISCLOSURE,
    OPPORTUNITY_INTRO,
    COMPUTED_DIMENSIONS_INTRO,
    ...COMPUTED_DIMENSIONS.map((d) => d.line),
    FOUNDING_LINE,
    ...Object.values(RESULT_HEADINGS),
  ];

  it('never states a competency count (counts are moving; say "the certified framework")', () => {
    for (const s of ALL_SCAN_STRINGS) {
      expect(s).not.toMatch(/\d+\s+competenc/i);
      expect(s).not.toMatch(/(fifty|forty|sixty|seventy)/i);
    }
    expect(DISCLOSURE).toMatch(/certified framework/);
  });

  it('never presents the bands as calibrated', () => {
    for (const s of Object.values(BAND_DESCRIPTORS)) {
      expect(s).not.toMatch(/calibrat/i);
    }
  });

  it('the disclosure states the self-reported-plus-observed boundary', () => {
    expect(DISCLOSURE).toMatch(/self-reported plus observed/);
    expect(DISCLOSURE).not.toMatch(/computed from your systems/);
  });

  it('no em-dash in any scan string', () => {
    for (const s of ALL_SCAN_STRINGS) {
      expect(s).not.toMatch(/—/);
    }
  });
});

describe('the readiness band headline', () => {
  it('covers all four band keys with descriptors', () => {
    expect(Object.keys(BAND_DESCRIPTORS).sort()).toEqual([
      'foundations_first', 'not_ready_yet', 'ready_in_parts', 'ready_to_build',
    ]);
  });

  it('bandMarker carries the composite and the self-reported wording', () => {
    const m = bandMarker(2.3);
    expect(m).toMatch(/2\.3 out of 5/);
    expect(m).toMatch(/based on what you told us about yourself/);
  });

  it('has the eyebrow', () => {
    expect(BAND_EYEBROW).toBe('Your AI readiness');
  });
});

describe('whyItDidNotStick', () => {
  it('composes up to three reasons in the respondent evidence register', () => {
    const text = whyItDidNotStick([
      { id: 'q11', score: 1 },
      { id: 'q8', score: 2 },
      { id: 'q9', score: 2 },
    ]);
    expect(text).toMatch(/^You told us that nobody has written down what data a tool may touch/);
    expect(text).toMatch(/that AI and automation sit on top of your own full plate/);
    expect(text).toMatch(/that your last rollout faded once the pushing stopped/);
    expect(text).toMatch(/That is not an AI problem/);
    expect(text).toMatch(/nothing existed to hold it in place/);
  });

  it('q8 reads differently at score 1 (nobody) vs score 2 (the founder)', () => {
    expect(whyItDidNotStick([{ id: 'q8', score: 1 }])).toMatch(/nobody owns AI and automation/);
    expect(whyItDidNotStick([{ id: 'q8', score: 2 }])).toMatch(/your own full plate/);
  });

  it('handles one and two reasons grammatically', () => {
    const one = whyItDidNotStick([{ id: 'q9', score: 2 }]);
    expect(one).toMatch(/You told us that your last rollout faded once the pushing stopped\./);
    const two = whyItDidNotStick([{ id: 'q9', score: 2 }, { id: 'q11', score: 2 }]);
    expect(two).toMatch(/faded once the pushing stopped, and that nobody has written down/);
  });

  it('falls back to the honest no-visible-cause variant when nothing is weak', () => {
    const text = whyItDidNotStick([]);
    expect(text).toMatch(/do not show the usual conditions/);
    expect(text).toMatch(/audit/);
    // Never smug, never "you should have known".
    expect(text).not.toMatch(/should have known/i);
  });

  it('skips signals with no authored reason phrase (q5 is the trigger, q13 is comfort)', () => {
    const text = whyItDidNotStick([{ id: 'q5', score: 2 }, { id: 'q13', score: 1 }]);
    expect(text).toMatch(/do not show the usual conditions/);
  });
});

describe('beliefContrast', () => {
  it('high confidence gets the doc 15 register verbatim', () => {
    const text = beliefContrast(4);
    expect(text).toMatch(/You rated your CRM data 4 out of 5\. That is a belief\./);
    expect(text).toMatch(/the gap is usually expensive/);
  });

  it('mid and low confidence get their own authored variants', () => {
    expect(beliefContrast(3)).toMatch(/Somewhat confident/);
    expect(beliefContrast(1)).toMatch(/Low confidence is itself a finding/);
    expect(beliefContrast(2)).toMatch(/2 out of 5/);
  });

  it('every variant names the audit as where Data Readiness is computed', () => {
    for (const score of [1, 2, 3, 4, 5]) {
      expect(beliefContrast(score)).toMatch(/audit computes/);
    }
  });
});

describe('observed copy and the DKIM caveat (binding copy law)', () => {
  it('speaks to SPF and DMARC definitively', () => {
    expect(OBSERVED_LINES.emailAuthMissing('no DMARC record')).toMatch(/not fully authenticated \(no DMARC record\)/);
    expect(OBSERVED_LINES.emailAuthMissing('no DMARC record')).toMatch(/build on sand/);
  });

  it('mentions DKIM only when the probe found one', () => {
    expect(OBSERVED_LINES.emailAuthOk(true)).toMatch(/DKIM key we could find/);
    expect(OBSERVED_LINES.emailAuthOk(false)).not.toMatch(/DKIM/);
  });

  it('NEVER reports DKIM absence as a missing record (negative control)', () => {
    // No authored observed string may claim a missing DKIM record.
    const all = [
      OBSERVED_LINES.emailAuthOk(false),
      OBSERVED_LINES.emailAuthOk(true),
      OBSERVED_LINES.emailAuthMissing('no SPF record, no DMARC record'),
      OBSERVED_BOUNDARY,
      OBSERVED_UNREACHABLE,
    ];
    for (const s of all) {
      expect(s).not.toMatch(/no DKIM|DKIM record missing|missing DKIM/i);
    }
  });

  it('absence claims are scoped to the page source, never to the business', () => {
    expect(OBSERVED_LINES.analyticsAbsent).toMatch(/in your page source/);
    expect(OBSERVED_LINES.schemaAbsent).toMatch(/in your page source/);
    expect(OBSERVED_LINES.adPixelsAbsent).toMatch(/in your page source/);
  });

  it('the unreachable line blames the read, not the business', () => {
    expect(OBSERVED_UNREACHABLE).toMatch(/says nothing about your business/);
  });

  it('the marker and boundary say observed, not connected', () => {
    expect(OBSERVED_MARKER).toBe('Observed from your public surfaces');
    expect(OBSERVED_BOUNDARY).toMatch(/not connected/);
  });

  it('paid-acquisition line reads pixels as evidence, not as certainty', () => {
    const s = OBSERVED_LINES.adPixelsPresent('a Meta Pixel');
    expect(s).toMatch(/a Meta Pixel/);
    expect(s).toMatch(/running or was set up to run/);
  });

  it('social presence line hands cadence to the audit', () => {
    expect(OBSERVED_LINES.socialPresence('LinkedIn and YouTube')).toMatch(/not readable from out here/);
  });
});

describe('dimension reads and level words', () => {
  it('LEVEL_WORDS covers 1..5 ending in Optimized', () => {
    expect(LEVEL_WORDS[1]).toBe('Absent');
    expect(LEVEL_WORDS[2]).toBe('Informal');
    expect(LEVEL_WORDS[3]).toBe('Functional');
    expect(LEVEL_WORDS[4]).toBe('Managed');
    expect(LEVEL_WORDS[5]).toBe('Optimized');
  });

  it('every dimension has a read for weak, middle and strong', () => {
    for (const key of ['strategy', 'people', 'governance']) {
      expect(dimensionRead(key, 1)).toBeTruthy();
      expect(dimensionRead(key, 2)).toBeTruthy();
      expect(dimensionRead(key, 3)).toBeTruthy();
      expect(dimensionRead(key, 4)).toBeTruthy();
      expect(dimensionRead(key, 5)).toBeTruthy();
      expect(dimensionRead(key, 2)).not.toBe(dimensionRead(key, 3));
      expect(dimensionRead(key, 3)).not.toBe(dimensionRead(key, 4));
    }
  });

  it('has the self-reported marker', () => {
    expect(SELF_REPORTED_MARKER).toBe('Self-reported');
  });
});

describe('the opportunity map copy', () => {
  it('area titles speak the Builds-menu language', () => {
    expect(AREA_TITLES.followupPipeline).toBe('Follow-up and pipeline automation');
    expect(AREA_TITLES.busywork).toBe('Busywork automation');
    expect(AREA_TITLES.onboardingCs).toBe('Onboarding and customer-success automation');
    expect(AREA_TITLES.deadLead).toBe('Dead-lead reactivation');
    expect(AREA_TITLES.speedToLead).toBe('Speed to lead');
    expect(AREA_TITLES.invoiceCollection).toBe('Invoice collection');
  });

  it('verdict labels are the decided three states', () => {
    expect(VERDICT_LABELS.ready).toBe('Ready, as far as we can see');
    expect(VERDICT_LABELS.blocked).toBe('Not yet');
    expect(VERDICT_LABELS.audit).toBe('The audit computes this');
  });

  it('speed-to-lead computes nothing and says so', () => {
    const s = speedToLeadBody('professional services', '2 days');
    expect(s).toMatch(/We did not ask your lead response time/);
    expect(s).toMatch(/2 days/);
    expect(s).toMatch(/audit computes from your CRM timestamps/);
  });

  it('dead-lead and invoice rows quote no invented dollars', () => {
    const s = deadLeadBody('$62K', 'the middle of the band you picked');
    expect(s).toMatch(/audit counts from your CRM/);
    expect(DEAD_LEAD_BODY_GENERIC).toMatch(/audit counts from your CRM/);
    expect(INVOICE_COLLECTION_BODY).toMatch(/audit reads it from there/);
    // No benchmark-free dollar claims beyond their own deal input.
    expect(INVOICE_COLLECTION_BODY).not.toMatch(/\$/);
  });

  it('fmtResponseDays renders hours under a day', () => {
    expect(fmtResponseDays(0.5)).toBe('12 hours');
    expect(fmtResponseDays(0.02)).toBe('1 hour');
    expect(fmtResponseDays(1)).toBe('1 day');
    expect(fmtResponseDays(1.9)).toBe('2 days');
  });

  it('the shown-arithmetic lines name their inputs and provenance', () => {
    expect(provenancePhrase(true)).toBe('your exact figure');
    expect(provenancePhrase(false)).toBe('the middle of the band you picked');
    const line = MATH_LINES.revenuePerEmployee({
      revenueDisplay: '$10.0M', revenueProv: 'your exact figure',
      teamDisplay: '63', teamProv: 'the middle of the band you picked',
      rpeDisplay: '$159K', medianDisplay: '$170K',
    });
    expect(line).toMatch(/The math: \$10\.0M annual revenue \(your exact figure\)/);
    expect(line).toMatch(/\$170K peer median/);
    expect(MATH_LINES.retention({ grrDisplay: '60%', churnProv: 'x', medianDisplay: '82%', revenueDisplay: '$10.0M', revenueProv: 'x' })).toMatch(/^The math:/);
    expect(CAP_NOTE).toMatch(/capped/);
  });

  it('no-gap and not-tracked rows have honest copy', () => {
    expect(NO_GAP_ROW_LINE).toMatch(/holds? up/);
    expect(NOT_TRACKED_ROW_LINE).toMatch(/we will not invent one/);
    expect(NO_GAP_HEADLINE.lead).toMatch(/\{model_label\}/);
  });

  it('COMPARISON_COPY covers the four metric keys in all three bands', () => {
    for (const key of ['salesCycle', 'retention', 'revenuePerEmployee', 'leadResponse']) {
      for (const band of ['meets', 'partial', 'fails']) {
        expect(COMPARISON_COPY[key][band]).toBeTypeOf('string');
      }
    }
  });
});

describe('the first move', () => {
  it('ships six authored paragraphs, all clean and substantial', () => {
    expect(Object.keys(FIRST_MOVES).sort()).toEqual([
      'governance_review', 'governance_rules', 'people_owner', 'people_rollout', 'strategy_number', 'strategy_rule',
    ]);
    for (const [key, text] of Object.entries(FIRST_MOVES)) {
      expect(text.length, key).toBeGreaterThan(100);
      expect(text, key).not.toMatch(/—/);
    }
  });

  it('the people_owner move carries the doc 15 example register', () => {
    expect(FIRST_MOVES.people_owner).toMatch(/Name an automation owner this week/);
    expect(FIRST_MOVES.people_owner).toMatch(/single condition that most decides/);
  });

  it('pickFirstMoveKey maps the weakest question to its authored move', () => {
    expect(pickFirstMoveKey('strategy', 'q6')).toBe('strategy_rule');
    expect(pickFirstMoveKey('strategy', 'q5')).toBe('strategy_number');
    expect(pickFirstMoveKey('strategy', 'q7')).toBe('strategy_number');
    expect(pickFirstMoveKey('people', 'q8')).toBe('people_owner');
    expect(pickFirstMoveKey('people', 'q9')).toBe('people_rollout');
    expect(pickFirstMoveKey('governance', 'q11')).toBe('governance_rules');
    expect(pickFirstMoveKey('governance', 'q12')).toBe('governance_review');
    expect(pickFirstMoveKey('governance', 'q13')).toBe('governance_rules');
  });

  it('falls back deterministically on unknown ids', () => {
    expect(pickFirstMoveKey('people', 'q99')).toBe('people_owner');
    expect(pickFirstMoveKey('nonsense', 'q99')).toBe('strategy_number');
  });
});

describe('the CTA block', () => {
  it('names the three computed dimensions with one line each', () => {
    expect(COMPUTED_DIMENSIONS.map((d) => d.name)).toEqual([
      'Data Readiness', 'Systems Readiness', 'Process Readiness',
    ]);
    for (const d of COMPUTED_DIMENSIONS) {
      expect(d.line).toMatch(/audit|connected|inside|behaves/);
    }
  });

  it('CTA heading and lines pull from the offer ladder', () => {
    expect(CTA_HEADING).toBe('The AI Revenue Audit');
    expect(CTA_LINES).toHaveLength(4);
    expect(CTA_LINES[3]).toMatch(/\$2,500/);
    expect(CTA_LINES[3]).toMatch(/100 percent/);
  });

  it('the founding line names the decided terms from lib/offers.js', () => {
    expect(FOUNDING_LINE).toMatch(/founding window is open/);
    expect(FOUNDING_LINE).toMatch(/100 percent toward your first build/);
    expect(FOUNDING_LINE).toMatch(/first two months of the Care Plan included/);
    expect(FOUNDING_LINK_LABEL).toMatch(/founding-client terms/);
  });
});

describe('formatting helpers', () => {
  it('sourceCitation emits the v1.2 footer with the model label', () => {
    expect(sourceCitation('B2B SaaS')).toBe('Source: businessModelBenchmarks v1.2, B2B SaaS row.');
  });

  it('formatUsd formats millions, thousands and dollars', () => {
    expect(formatUsd(2_400_000)).toBe('$2.4M');
    expect(formatUsd(150_000)).toBe('$150K');
    expect(formatUsd(15_500)).toBe('$16K');
    expect(formatUsd(750)).toBe('$750');
  });

  it('metricCitation emits the named metric source with the asOf year', () => {
    const metric = { source: 'SaaS Capital 2025', asOf: 2025 };
    expect(metricCitation(metric)).toBe('Source: SaaS Capital 2025 (2025).');
    expect(metricCitation({ source: 'Foo report' })).toBe('Source: Foo report.');
    expect(metricCitation(null)).toBe('');
    expect(metricCitation({ asOf: 2025 })).toBe('');
  });

  it('bandTitle returns the metric titles', () => {
    expect(bandTitle('revenuePerEmployee')).toBe('Revenue per employee gap');
    expect(bandTitle('salesCycle')).toBe('Sales cycle compression');
    expect(bandTitle('retention')).toBe('Retention gap');
    expect(bandTitle('leadResponse')).toBe('Lead response peer gap');
  });
});

describe('quiz section copy', () => {
  it('section 2 is the ten-question diagnostic', () => {
    expect(SECTION_LABELS[2]).toBe('Your AI readiness');
    expect(SECTION_SUBLINES[2]).toMatch(/Ten questions/);
  });

  it('section 3 invites exact figures', () => {
    expect(SECTION_SUBLINES[3]).toMatch(/exact figure/);
  });
});

describe('FIX_PARAGRAPHS (the per-area how-to-close copy)', () => {
  it('covers the six opportunity areas worth of keys', () => {
    expect(Object.keys(FIX_PARAGRAPHS).sort()).toEqual([
      'deadLead', 'invoiceCollection', 'leadResponse', 'retention', 'revenuePerEmployee', 'salesCycle',
    ]);
    for (const [key, text] of Object.entries(FIX_PARAGRAPHS)) {
      expect(text.length, key).toBeGreaterThan(40);
      expect(text, key).not.toMatch(/—/);
      expect(text, key).not.toMatch(/\bI\b/);
    }
  });
});

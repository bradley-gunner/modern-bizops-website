import { describe, it, expect } from 'vitest';
import { buildResult } from '@/lib/scorecard/resultRender';
import { FIRST_MOVES } from '@/lib/scorecard/voice';

// The burned buyer: composite 2.0 (Foundations First), weakest dimension
// strategy with q6 at 1.
function answers(overrides = {}) {
  return {
    q1: { value: '5m_15m' },
    q2: { value: 'PROFESSIONAL_SERVICES' },
    q3: { value: '51_75' },
    q4: { value: 'D', score: 4 },
    q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 }, q7: { value: 'B', score: 2 },
    q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 }, q10: { value: 'C', score: 3 },
    q11: { value: 'A', score: 1 }, q12: { value: 'B', score: 2 }, q13: { value: 'C', score: 3 },
    q14: { value: '25k_100k' }, q15: { value: 'over_180' }, q16: { value: 'over_30' },
    ...overrides,
  };
}

function observedFixture(overrides = {}) {
  return {
    url: 'https://example.com/', host: 'example.com', status: 'ok', pageRead: true,
    analytics: { checked: true, ga4: true, gtm: false },
    adPixels: { checked: true, names: ['a Meta Pixel'] },
    social: { checked: true, platforms: ['LinkedIn', 'YouTube'] },
    schema: { checked: true, types: [] },
    emailAuth: { checked: true, domain: 'example.com', spf: true, dmarc: false, dkim: null, missing: ['no DMARC record'] },
    freshness: { checked: true, lastPublished: '2026-02-10', source: 'sitemap' },
    ...overrides,
  };
}

const GENERATED_AT = '2026-08-14T12:00:00.000Z';

describe('buildResult: the band headline (section 1)', () => {
  it('leads with the readiness band, not a dollar figure', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT });
    expect(r.band.name).toBe('Foundations First');
    expect(r.band.composite).toBe(2.0);
    expect(r.band.marker).toMatch(/based on what you told us about yourself/);
    expect(r.band.descriptor).toBeTruthy();
  });

  it('the belief probe does not move the band (q4 excluded from composite)', () => {
    const low = buildResult(answers({ q4: { value: 'A', score: 1 } }), { generatedAt: GENERATED_AT });
    const high = buildResult(answers({ q4: { value: 'E', score: 5 } }), { generatedAt: GENERATED_AT });
    expect(low.band.composite).toBe(high.band.composite);
  });

  it('the retired stage machinery is gone from the payload', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT });
    expect(r.placement).toBeUndefined();
    expect(r.competencyScores).toBeUndefined();
    expect(r.brightSpots).toBeUndefined();
    expect(r.nextStage).toBeUndefined();
    expect(r.headline).toBeUndefined();
  });
});

describe('why it did not stick (section 2, the burned-attempt flag)', () => {
  it('renders only when q5 is the tried-and-did-not-stick option', () => {
    const burned = buildResult(answers(), { generatedAt: GENERATED_AT });
    expect(burned.burnedAttempt).toBe(true);
    expect(burned.whyItDidNotStick.text).toMatch(/You told us/);

    const never = buildResult(answers({ q5: { value: 'A', score: 1 } }), { generatedAt: GENERATED_AT });
    expect(never.burnedAttempt).toBe(false);
    expect(never.whyItDidNotStick).toBeNull();
  });

  it('builds the reasons from their own weakest signals', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT });
    // q6 (1) and q11 (1) are the weakest; both have authored reason phrases.
    expect(r.whyItDidNotStick.text).toMatch(/nothing written down decides which tools/);
    expect(r.whyItDidNotStick.text).toMatch(/what data a tool may touch/);
  });
});

describe('the belief contrast (section 3)', () => {
  it('plays the q4 answer back against the audit-computed dimension', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT });
    expect(r.belief.score).toBe(4);
    expect(r.belief.text).toMatch(/You rated your CRM data 4 out of 5/);
  });
});

describe('observed findings (section 4)', () => {
  it('is null when no URL was given, so the section never renders', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT });
    expect(r.observed).toBeNull();
    expect(r.observedFindings).toBeNull();
  });

  it('builds one authored line per readable signal, with tones', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT, observed: observedFixture() });
    const byKey = Object.fromEntries(r.observedFindings.lines.map((l) => [l.key, l]));
    expect(byKey.analytics.tone).toBe('good');
    expect(byKey.analytics.text).toMatch(/GA4/);
    expect(byKey.emailAuth.tone).toBe('gap');
    expect(byKey.emailAuth.text).toMatch(/no DMARC record/);
    expect(byKey.schema.tone).toBe('gap');
    expect(byKey.freshness.tone).toBe('gap'); // Feb 2026 vs Aug 2026 = stale
    expect(byKey.freshness.text).toMatch(/about 6 months ago/);
    expect(byKey.adPixels.text).toMatch(/Meta Pixel/);
    expect(byKey.social.text).toMatch(/LinkedIn and YouTube/);
    expect(r.observedFindings.boundary).toMatch(/not connected/);
  });

  it('mentions DKIM only when the probe found one (negative control)', () => {
    const without = buildResult(answers(), {
      generatedAt: GENERATED_AT,
      observed: observedFixture({ emailAuth: { checked: true, spf: true, dmarc: true, dkim: null, missing: [] } }),
    });
    expect(without.observedFindings.lines.find((l) => l.key === 'emailAuth').text).not.toMatch(/DKIM/);

    const withDkim = buildResult(answers(), {
      generatedAt: GENERATED_AT,
      observed: observedFixture({ emailAuth: { checked: true, spf: true, dmarc: true, dkim: true, missing: [] } }),
    });
    expect(withDkim.observedFindings.lines.find((l) => l.key === 'emailAuth').text).toMatch(/DKIM key we could find/);
  });

  it('never claims ad-pixel absence when a tag manager could be hiding them (negative control)', () => {
    const gtmHidden = buildResult(answers(), {
      generatedAt: GENERATED_AT,
      observed: observedFixture({
        analytics: { checked: true, ga4: false, gtm: true },
        adPixels: { checked: true, names: [] },
      }),
    });
    expect(gtmHidden.observedFindings.lines.find((l) => l.key === 'adPixels')).toBeUndefined();

    const noGtm = buildResult(answers(), {
      generatedAt: GENERATED_AT,
      observed: observedFixture({
        analytics: { checked: true, ga4: false, gtm: false },
        adPixels: { checked: true, names: [] },
      }),
    });
    expect(noGtm.observedFindings.lines.find((l) => l.key === 'adPixels').text).toMatch(/No ad platform tags/);
  });

  it('renders the graceful-absence copy for an unreachable site', () => {
    const r = buildResult(answers(), {
      generatedAt: GENERATED_AT,
      observed: {
        url: 'https://example.com/', host: 'example.com', status: 'unreachable', pageRead: false,
        analytics: { checked: false }, adPixels: { checked: false }, social: { checked: false },
        schema: { checked: false }, emailAuth: { checked: false },
        freshness: { checked: false, lastPublished: null, source: null },
      },
    });
    expect(r.observedFindings.unreachable).toBe(true);
    expect(r.observedFindings.text).toMatch(/could not read your site in time/);
  });

  it('skips the freshness line entirely when no date could be read (no false staleness)', () => {
    const r = buildResult(answers(), {
      generatedAt: GENERATED_AT,
      observed: observedFixture({ freshness: { checked: false, lastPublished: null, source: null } }),
    });
    expect(r.observedFindings.lines.find((l) => l.key === 'freshness')).toBeUndefined();
  });
});

describe('the dimension bars (section 5)', () => {
  it('scores the three askable dimensions with level words and reads', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT });
    expect(r.dimensions.items.map((d) => d.key)).toEqual(['strategy', 'people', 'governance']);
    const strategy = r.dimensions.items[0];
    expect(strategy.mean).toBe(1.7);
    expect(strategy.levelWord).toBe('Informal');
    expect(strategy.read).toBeTruthy();
    expect(r.dimensions.marker).toBe('Self-reported');
  });
});

describe('the opportunity map (section 6)', () => {
  it('verdicts consume the observed signals (unauthenticated domain blocks follow-up)', () => {
    const r = buildResult(answers({ q8: { value: 'D', score: 4 } }), {
      generatedAt: GENERATED_AT,
      observed: observedFixture(),
    });
    const row = r.opportunity.rows.find((x) => x.area === 'followupPipeline');
    expect(row.verdict.state).toBe('blocked');
    expect(row.verdict.gap).toMatch(/no DMARC record/);
  });

  it('the ready verdict fires when a named owner meets an authenticated domain', () => {
    const r = buildResult(answers({ q8: { value: 'D', score: 4 } }), {
      generatedAt: GENERATED_AT,
      observed: observedFixture({ emailAuth: { checked: true, spf: true, dmarc: true, dkim: null, missing: [] } }),
    });
    const row = r.opportunity.rows.find((x) => x.area === 'followupPipeline');
    expect(row.verdict.state).toBe('ready');
  });

  it('the no-gap variant keeps the page alive: headline swap plus a full map', () => {
    const r = buildResult(answers({
      q3: { value: '26_50' },
      q15: { value: 'under_30' },
      q16: { value: 'under_5' },
    }), { generatedAt: GENERATED_AT });
    expect(r.opportunity.noGap.lead).toMatch(/professional services peers/);
    // Five rows: both computed metrics hold up, and the follow-up evidence row
    // drops out because the cycle meets peer. Never an empty page.
    expect(r.opportunity.rows.length).toBe(5);
  });
});

describe('the first move (section 7)', () => {
  it('prescribes from the weakest dimension and its lowest question', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT });
    // strategy is weakest (1.7); q6 (score 1) is its lowest -> the tool rule.
    expect(r.firstMove.dimensionKey).toBe('strategy');
    expect(r.firstMove.text).toBe(FIRST_MOVES.strategy_rule);
  });

  it('moves with the weakest dimension', () => {
    const r = buildResult(answers({
      q5: { value: 'B', score: 2 }, q6: { value: 'D', score: 4 }, q7: { value: 'D', score: 4 },
      q8: { value: 'A', score: 1 }, q9: { value: 'B', score: 2 }, q10: { value: 'B', score: 2 },
      q11: { value: 'D', score: 4 }, q12: { value: 'D', score: 4 }, q13: { value: 'D', score: 4 },
    }), { generatedAt: GENERATED_AT });
    expect(r.firstMove.dimensionKey).toBe('people');
    expect(r.firstMove.text).toBe(FIRST_MOVES.people_owner);
  });
});

describe('the CTA block (section 8)', () => {
  it('links the audit through the tracked destination with the founding line', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT });
    expect(r.cta.destination).toBe('/ai-readiness-assessment');
    expect(r.cta.heading).toBe('The AI Revenue Audit');
    expect(r.cta.cardLines).toHaveLength(4);
    expect(r.cta.foundingLine).toMatch(/founding window/);
    expect(r.cta.foundingHref).toBe('/founding-clients');
    expect(r.cta.buttonLabel).toBe('See the AI Revenue Audit');
  });

  it('names the three computed dimensions, greyed and unscored', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT });
    expect(r.computedDimensions.items.map((d) => d.name)).toEqual([
      'Data Readiness', 'Systems Readiness', 'Process Readiness',
    ]);
  });
});

describe('payload plumbing', () => {
  it('passes generatedAt through and stamps the benchmark version', () => {
    const r = buildResult(answers(), { generatedAt: GENERATED_AT });
    expect(r.generatedAt).toBe(GENERATED_AT);
    expect(r.benchmarkVersion).toBe('1.2');
    expect(r.modelLabel).toBe('professional services');
  });

  it('prunes answers to visible questions (a stale q16 for e-commerce cannot leak)', () => {
    const a = answers({ q2: { value: 'ECOMMERCE' } });
    const r = buildResult(a, { generatedAt: GENERATED_AT });
    expect(r.opportunity.rows.find((x) => x.area === 'onboardingCs')).toBeUndefined();
  });
});

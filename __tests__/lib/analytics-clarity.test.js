import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { webcrypto, createHash } from 'node:crypto';
import { trackEvent, setClarityTrafficTags, identifyLead } from '@/lib/analytics';

// Records every window.clarity(...) call so we can assert the mirror fires the
// right events/tags/identify without a live Clarity tag.
describe('Clarity behavioral mirror', () => {
  let calls;

  beforeEach(() => {
    calls = [];
    window.clarity = vi.fn((...args) => calls.push(args));
    window.gtag = undefined;
    // jsdom ships Crypto without SubtleCrypto; use Node's WebCrypto so the
    // browser-side SHA-256 in identifyLead can run under test.
    if (!window.crypto?.subtle) {
      Object.defineProperty(window, 'crypto', { value: webcrypto, configurable: true });
    }
    sessionStorage.clear();
  });

  afterEach(() => {
    delete window.clarity;
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('mirrors a tracked event name as a Clarity custom event', () => {
    trackEvent('cta_click', { cta_label: 'Book a call' });
    expect(calls).toContainEqual(['event', 'cta_click']);
  });

  it('promotes only allowlisted params to Clarity tags', () => {
    trackEvent('generate_lead', { lead_magnet: 'scorecard', value: 1 });
    expect(calls).toContainEqual(['event', 'generate_lead']);
    expect(calls).toContainEqual(['set', 'lead_magnet', 'scorecard']);
    // `value` is not on the allowlist, so it must not become a tag.
    expect(calls.find((c) => c[0] === 'set' && c[1] === 'value')).toBeUndefined();
  });

  it('skips tags whose value is empty', () => {
    trackEvent('form_submit', { form_name: '', lead_magnet: 'playbook' });
    expect(calls).toContainEqual(['set', 'lead_magnet', 'playbook']);
    expect(calls.find((c) => c[0] === 'set' && c[1] === 'form_name')).toBeUndefined();
  });

  it('tags first-touch UTMs captured in sessionStorage', () => {
    sessionStorage.setItem(
      'mbo_utms',
      JSON.stringify({ utm_source: 'google', utm_campaign: 'spring' })
    );
    setClarityTrafficTags();
    expect(calls).toContainEqual(['set', 'utm_source', 'google']);
    expect(calls).toContainEqual(['set', 'utm_campaign', 'spring']);
  });

  it('identifies a lead by a SHA-256 hash of the normalized email, never raw PII', async () => {
    await identifyLead('  Founder@Example.com ');
    const expected = createHash('sha256').update('founder@example.com').digest('hex');
    expect(calls).toContainEqual(['identify', expected]);
    const serialized = JSON.stringify(calls);
    expect(serialized).not.toContain('Founder@Example.com');
    expect(serialized).not.toContain('founder@example.com');
  });

  it('no-ops identify when there is no email', async () => {
    await identifyLead('');
    expect(calls.find((c) => c[0] === 'identify')).toBeUndefined();
  });

  it('no-ops every Clarity call when the tag is absent', () => {
    delete window.clarity;
    expect(() => trackEvent('cta_click', { lead_magnet: 'scorecard' })).not.toThrow();
    expect(() => setClarityTrafficTags()).not.toThrow();
  });
});

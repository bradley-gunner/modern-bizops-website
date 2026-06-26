import { describe, it, expect, afterEach } from 'vitest';
import { getHubspotutk } from '@/lib/hubspot-client';

describe('getHubspotutk', () => {
  afterEach(() => {
    // clear any cookies set during a test
    document.cookie = 'hubspotutk=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  it('returns the hubspotutk cookie value when present', () => {
    document.cookie = 'foo=bar';
    document.cookie = 'hubspotutk=abc123def';
    expect(getHubspotutk()).toBe('abc123def');
  });

  it('returns empty string when the cookie is absent', () => {
    expect(getHubspotutk()).toBe('');
  });

  it('decodes a percent-encoded cookie value', () => {
    document.cookie = 'hubspotutk=abc%2B123';
    expect(getHubspotutk()).toBe('abc+123');
  });
});

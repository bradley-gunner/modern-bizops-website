import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// node:dns/promises is mocked so the observed pass is hermetic: no real
// lookups, and the SSRF guard can be exercised against controlled answers.
const dnsMock = vi.hoisted(() => ({
  resolveTxt: vi.fn(),
  lookup: vi.fn(),
}));
vi.mock('node:dns/promises', () => ({ ...dnsMock, default: dnsMock }));

const { observeWebsite, normalizeWebsiteUrl, OBSERVED_BUDGET_MS } = await import('@/lib/scorecard/observed');

function txtErr(code) {
  const e = new Error(code);
  e.code = code;
  return e;
}

// A DNS table keyed by record name; anything absent answers ENOTFOUND, which
// is a real "no record here" answer rather than a failure.
function mockDns(table) {
  dnsMock.resolveTxt.mockImplementation(async (name) => {
    if (name in table) return table[name].map((s) => [s]);
    throw txtErr('ENOTFOUND');
  });
}

function htmlResponse(body) {
  return {
    ok: true,
    status: 200,
    headers: new Map(),
    body: null,
    text: async () => body,
  };
}

beforeEach(() => {
  dnsMock.resolveTxt.mockReset();
  dnsMock.lookup.mockReset();
  dnsMock.lookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);
  mockDns({});
  global.fetch = vi.fn(async () => htmlResponse('<html></html>'));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('normalizeWebsiteUrl', () => {
  it('accepts bare domains and adds https', () => {
    expect(normalizeWebsiteUrl('example.com').href).toBe('https://example.com/');
    expect(normalizeWebsiteUrl('  www.example.com/path  ').href).toBe('https://www.example.com/path');
    expect(normalizeWebsiteUrl('http://example.com').protocol).toBe('http:');
  });

  it('rejects junk, non-http schemes, credentials and hostless input', () => {
    expect(normalizeWebsiteUrl('')).toBeNull();
    expect(normalizeWebsiteUrl(null)).toBeNull();
    expect(normalizeWebsiteUrl('not a url')).toBeNull();
    expect(normalizeWebsiteUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeWebsiteUrl('file:///etc/passwd')).toBeNull();
    expect(normalizeWebsiteUrl('https://user:pass@example.com')).toBeNull();
    expect(normalizeWebsiteUrl('localhost')).toBeNull();
  });
});

describe('observeWebsite: the SSRF guard (negative controls)', () => {
  it('returns null for an unusable URL and never fetches', async () => {
    expect(await observeWebsite('')).toBeNull();
    expect(await observeWebsite('nonsense')).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('never fetches a host that resolves to a private address', async () => {
    dnsMock.lookup.mockResolvedValue([{ address: '10.0.0.5', family: 4 }]);
    const out = await observeWebsite('internal.example.com');
    expect(out.status).toBe('unreachable');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('never fetches a literal private IP', async () => {
    for (const host of ['127.0.0.1', '192.168.1.1', '169.254.169.254', '172.16.0.1']) {
      global.fetch.mockClear();
      const out = await observeWebsite(host);
      expect(out.status, host).toBe('unreachable');
      expect(global.fetch, host).not.toHaveBeenCalled();
    }
  });

  it('never fetches a private IPv6 or loopback', async () => {
    global.fetch.mockClear();
    // A bracketed IPv6 literal has no dot, so it is rejected at normalization
    // and the observed block simply never renders.
    expect(await observeWebsite('http://[::1]/')).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('a private host produces NO observed signals at all, not even DNS', async () => {
    dnsMock.lookup.mockResolvedValue([{ address: '10.0.0.5', family: 4 }]);
    mockDns({ 'internal.example.com': ['v=spf1 -all'] });
    const out = await observeWebsite('internal.example.com');
    expect(out.emailAuth).toEqual({ checked: false });
    expect(out.analytics).toEqual({ checked: false });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('observeWebsite: page-source signals', () => {
  it('detects GA4, GTM, ad pixels, schema types and social links', async () => {
    global.fetch.mockResolvedValue(htmlResponse(`
      <html><head>
        <script src="https://www.googletagmanager.com/gtag/js?id=G-ABC123"></script>
        <script src="https://www.googletagmanager.com/gtm.js?id=GTM-XYZ"></script>
        <script src="https://connect.facebook.net/en_US/fbevents.js"></script>
        <script>_linkedin_partner_id = "123";</script>
        <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Acme"}</script>
      </head><body>
        <a href="https://www.linkedin.com/company/acme">LinkedIn</a>
        <a href="https://youtube.com/@acme">YouTube</a>
      </body></html>
    `));
    const out = await observeWebsite('example.com');
    expect(out.status).toBe('ok');
    expect(out.analytics).toMatchObject({ checked: true, ga4: true, gtm: true });
    expect(out.adPixels.names).toEqual(expect.arrayContaining(['a Meta Pixel', 'a LinkedIn Insight Tag']));
    expect(out.schema.types).toContain('Organization');
    expect(out.social.platforms).toEqual(expect.arrayContaining(['LinkedIn', 'YouTube']));
  });

  it('negative control: a clean page reports absence rather than false positives', async () => {
    global.fetch.mockResolvedValue(htmlResponse('<html><body><p>Hello</p></body></html>'));
    const out = await observeWebsite('example.com');
    expect(out.analytics).toMatchObject({ checked: true, ga4: false, gtm: false });
    expect(out.adPixels).toEqual({ checked: true, names: [] });
    expect(out.schema).toEqual({ checked: true, types: [] });
    expect(out.social).toEqual({ checked: true, platforms: [] });
  });

  it('does not false-positive on brand names in body copy', async () => {
    global.fetch.mockResolvedValue(htmlResponse(
      '<html><body><p>We use Google Analytics and a Facebook pixel and schema markup.</p></body></html>'
    ));
    const out = await observeWebsite('example.com');
    expect(out.analytics.ga4).toBe(false);
    expect(out.adPixels.names).toEqual([]);
    expect(out.schema.types).toEqual([]);
  });

  it('parses @graph JSON-LD and microdata itemtypes, and survives malformed blocks', async () => {
    global.fetch.mockResolvedValue(htmlResponse(`
      <script type="application/ld+json">{"@graph":[{"@type":"WebSite"},{"@type":["LocalBusiness","Organization"]}]}</script>
      <script type="application/ld+json">{ this is not json }</script>
      <div itemscope itemtype="https://schema.org/FAQPage"></div>
    `));
    const out = await observeWebsite('example.com');
    expect(out.schema.types).toEqual(expect.arrayContaining(['WebSite', 'LocalBusiness', 'Organization', 'FAQPage']));
  });

  it('an unreachable page still lets the DNS half report', async () => {
    global.fetch.mockRejectedValue(new Error('ECONNREFUSED'));
    mockDns({ 'example.com': ['v=spf1 include:_spf.google.com ~all'], '_dmarc.example.com': ['v=DMARC1; p=none'] });
    const out = await observeWebsite('example.com');
    expect(out.status).toBe('partial');
    expect(out.pageRead).toBe(false);
    expect(out.emailAuth).toMatchObject({ checked: true, spf: true, dmarc: true });
  });
});

describe('observeWebsite: email authentication and the DKIM caveat', () => {
  it('reports SPF and DMARC definitively when both exist', async () => {
    mockDns({
      'example.com': ['v=spf1 include:_spf.google.com ~all'],
      '_dmarc.example.com': ['v=DMARC1; p=quarantine'],
    });
    const out = await observeWebsite('example.com');
    expect(out.emailAuth).toMatchObject({ checked: true, spf: true, dmarc: true, missing: [] });
  });

  it('names exactly what is missing', async () => {
    mockDns({ 'example.com': ['v=spf1 -all'] });
    const out = await observeWebsite('example.com');
    expect(out.emailAuth.spf).toBe(true);
    expect(out.emailAuth.dmarc).toBe(false);
    expect(out.emailAuth.missing).toEqual(['no DMARC record']);
  });

  it('DKIM is true on a selector hit and NULL otherwise, never false', async () => {
    mockDns({
      'example.com': ['v=spf1 -all'],
      '_dmarc.example.com': ['v=DMARC1; p=none'],
    });
    const without = await observeWebsite('example.com');
    expect(without.emailAuth.dkim).toBeNull();
    expect(without.emailAuth.dkim).not.toBe(false);

    mockDns({
      'example.com': ['v=spf1 -all'],
      '_dmarc.example.com': ['v=DMARC1; p=none'],
      'google._domainkey.example.com': ['v=DKIM1; k=rsa; p=MIIBIjANBg'],
    });
    const withDkim = await observeWebsite('example.com');
    expect(withDkim.emailAuth.dkim).toBe(true);
  });

  it('a DNS FAILURE (not NXDOMAIN) reports nothing rather than claiming absence', async () => {
    dnsMock.resolveTxt.mockRejectedValue(txtErr('ESERVFAIL'));
    const out = await observeWebsite('example.com');
    expect(out.emailAuth).toEqual({ checked: false });
  });

  it('falls through www to the registrable domain for mail identity', async () => {
    mockDns({
      'example.com': ['v=spf1 include:_spf.google.com ~all'],
      '_dmarc.example.com': ['v=DMARC1; p=none'],
    });
    const out = await observeWebsite('www.example.com');
    expect(out.emailAuth).toMatchObject({ checked: true, domain: 'example.com', spf: true, dmarc: true });
  });
});

describe('observeWebsite: content freshness', () => {
  it('reads the newest lastmod from the sitemap', async () => {
    global.fetch.mockImplementation(async (url) => {
      const href = String(url);
      if (href.endsWith('/sitemap.xml')) {
        return htmlResponse('<urlset><url><lastmod>2026-01-02</lastmod></url><url><lastmod>2026-05-20</lastmod></url></urlset>');
      }
      return htmlResponse('<html></html>');
    });
    const out = await observeWebsite('example.com');
    expect(out.freshness).toMatchObject({ checked: true, lastPublished: '2026-05-20', source: 'sitemap' });
  });

  it('falls back to a declared feed when the sitemap has no dates', async () => {
    global.fetch.mockImplementation(async (url) => {
      const href = String(url);
      if (href.endsWith('/sitemap.xml')) return htmlResponse('<urlset><url><loc>https://example.com/</loc></url></urlset>');
      if (href.includes('/feed')) return htmlResponse('<rss><item><pubDate>Tue, 03 Mar 2026 10:00:00 GMT</pubDate></item></rss>');
      return htmlResponse('<html><head><link rel="alternate" type="application/rss+xml" href="/feed.xml"></head></html>');
    });
    const out = await observeWebsite('example.com');
    expect(out.freshness).toMatchObject({ checked: true, source: 'feed' });
    expect(out.freshness.lastPublished).toBe('2026-03-03');
  });

  it('negative control: reports nothing readable rather than a wrong date', async () => {
    global.fetch.mockImplementation(async (url) => {
      if (String(url).endsWith('/sitemap.xml')) throw new Error('404');
      return htmlResponse('<html></html>');
    });
    const out = await observeWebsite('example.com');
    expect(out.freshness).toEqual({ checked: false, lastPublished: null, source: null });
  });

  it('ignores future-dated entries', async () => {
    const future = new Date(Date.now() + 400 * 86_400_000).toISOString().slice(0, 10);
    global.fetch.mockImplementation(async (url) => {
      if (String(url).endsWith('/sitemap.xml')) {
        return htmlResponse(`<urlset><url><lastmod>${future}</lastmod></url><url><lastmod>2026-04-01</lastmod></url></urlset>`);
      }
      return htmlResponse('<html></html>');
    });
    const out = await observeWebsite('example.com');
    expect(out.freshness.lastPublished).toBe('2026-04-01');
  });
});

describe('observeWebsite: the time budget', () => {
  it('is bounded inside doc 15s 8 to 10 second window', () => {
    expect(OBSERVED_BUDGET_MS).toBeGreaterThanOrEqual(8_000);
    expect(OBSERVED_BUDGET_MS).toBeLessThanOrEqual(10_000);
  });

  it('resolves at the budget with whatever landed, rather than hanging', async () => {
    vi.useFakeTimers();
    // A page fetch that never settles; DNS answers immediately.
    global.fetch.mockImplementation(() => new Promise(() => {}));
    mockDns({ 'example.com': ['v=spf1 -all'], '_dmarc.example.com': ['v=DMARC1; p=none'] });

    const p = observeWebsite('example.com');
    await vi.advanceTimersByTimeAsync(OBSERVED_BUDGET_MS + 100);
    const out = await p;
    vi.useRealTimers();

    // The DNS half that completed survives the budget expiring.
    expect(out.emailAuth).toMatchObject({ checked: true, spf: true });
    expect(out.pageRead).toBe(false);
    expect(out.status).toBe('partial');
  });

  it('never throws, whatever the network does', async () => {
    global.fetch.mockRejectedValue(new Error('boom'));
    dnsMock.resolveTxt.mockRejectedValue(new Error('boom'));
    const out = await observeWebsite('example.com');
    expect(out.status).toBe('unreachable');
    expect(out.host).toBe('example.com');
  });
});

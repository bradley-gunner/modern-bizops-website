/**
 * The observed pass: four signals read from a prospect's public surfaces,
 * fetched server-side while the Scan result computes. Doc 15 decision 3.
 *
 * The v1 signal set is deliberately the fast subset of the D9 table:
 *   1. Analytics presence (GA4/GTM)                        <- page source
 *   2. Email sending infrastructure (SPF/DMARC, DKIM probe) <- public DNS
 *   3. Schema markup presence and types                    <- page source
 *   4. Content freshness (sitemap/feed last-published)     <- sitemap/feed
 * Plus two same-fetch additions (Bradley, 2026-08-14): ad platform pixels as
 * the paid-acquisition proxy, and linked social platforms (presence only).
 * Ad-library lookups and posting cadence stay in the audit; they have no
 * supported public API and cannot fit the budget.
 *
 * Boundaries, all binding:
 *   - Hard overall budget (OBSERVED_BUDGET_MS, inside doc 15's 8-10s window).
 *     A slow or unreadable site never blocks the result; the caller renders
 *     the graceful-absence copy instead.
 *   - Nothing is stored beyond the returned payload. No caching, no logging
 *     of page content. If that ever changes, the privacy disclosure widens.
 *   - SPF and DMARC live at known DNS names and are reported definitively.
 *     DKIM sits behind a selector name we cannot enumerate, so `dkim` is
 *     `true` when a common-selector probe found one and `null` otherwise,
 *     NEVER `false`: absence of evidence must not be reported as a missing
 *     record.
 *   - The URL is visitor-supplied, so every fetch guards against private
 *     addresses (SSRF): hosts are resolved and checked before any request,
 *     redirects are followed manually with the same check per hop.
 *
 * The audit app's websiteIntelligence.js proves the page-source techniques;
 * this is the deliberately lightweight local version, not an import of it.
 */

import { resolveTxt, lookup } from 'node:dns/promises';

export const OBSERVED_BUDGET_MS = 9_000;
const PAGE_TIMEOUT_MS = 6_000;
const AUX_TIMEOUT_MS = 4_500;
const MAX_BODY_BYTES = 700_000;
const MAX_REDIRECTS = 3;

/** Selectors a DKIM probe can defensibly try. Common across Google Workspace,
 *  Microsoft 365, and the big senders. */
const DKIM_SELECTORS = ['google', 'selector1', 'selector2', 'default', 'k1', 's1'];

/** Ad platform tags specifically: their presence is the Scan-visible proxy
 *  for paid acquisition (ad-library lookups have no supported public API and
 *  stay in the audit's website-intelligence pass). Deliberately excludes
 *  martech like HubSpot tracking, which says nothing about ad spend. */
const AD_PIXEL_SIGNATURES = [
  { name: 'a Meta Pixel', patterns: [/connect\.facebook\.net\/[a-z_]+\/fbevents\.js/i, /fbq\(\s*['"]init['"]/i] },
  { name: 'a LinkedIn Insight Tag', patterns: [/snap\.licdn\.com\/li\.lms-analytics/i, /_linkedin_partner_id/i] },
  { name: 'a Google Ads tag', patterns: [/googletagmanager\.com\/gtag\/js\?id=aw-/i, /googleads\.g\.doubleclick\.net/i] },
  { name: 'a TikTok Pixel', patterns: [/analytics\.tiktok\.com/i] },
];

const GA4_PATTERNS = [/googletagmanager\.com\/gtag\/js\?id=g-/i, /gtag\(\s*['"]config['"]\s*,\s*['"]g-/i];
const GTM_PATTERNS = [/googletagmanager\.com\/gtm\.js/i, /gtm\.start/i];

/** Social platforms detectable as linked profiles in the page source.
 *  Presence only: posting cadence is not readable from the outside. */
const SOCIAL_PLATFORMS = [
  { name: 'LinkedIn', pattern: /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in|school)\//i },
  { name: 'Facebook', pattern: /https?:\/\/(?:www\.)?facebook\.com\/(?!sharer|share\.php|ads\/)[A-Za-z0-9.]{3,}/i },
  { name: 'Instagram', pattern: /https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9._]{2,}/i },
  { name: 'X', pattern: /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/(?!intent|share)[A-Za-z0-9_]{2,}/i },
  { name: 'YouTube', pattern: /https?:\/\/(?:www\.)?youtube\.com\/(?:@|channel\/|c\/|user\/)/i },
  { name: 'TikTok', pattern: /https?:\/\/(?:www\.)?tiktok\.com\/@/i },
];

/* ------------------------------------------------------------------ */
/* URL hygiene and SSRF guarding                                      */
/* ------------------------------------------------------------------ */

export function normalizeWebsiteUrl(input) {
  if (typeof input !== 'string') return null;
  let raw = input.trim();
  if (!raw) return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) raw = `https://${raw}`;
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.username || url.password) return null;
  if (!url.hostname.includes('.')) return null;
  return url;
}

function isPrivateIpv4(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function isPrivateAddress(address, family) {
  if (family === 4) return isPrivateIpv4(address);
  const ip = address.toLowerCase();
  if (ip === '::' || ip === '::1') return true;
  if (ip.startsWith('fe8') || ip.startsWith('fe9') || ip.startsWith('fea') || ip.startsWith('feb')) return true;
  if (ip.startsWith('fc') || ip.startsWith('fd')) return true;
  if (ip.startsWith('::ffff:')) return isPrivateIpv4(ip.slice(7));
  return false;
}

async function assertPublicHost(hostname) {
  const bare = hostname.replace(/^\[|\]$/g, '');
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(bare)) {
    throw new Error('private host');
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(bare)) {
    if (isPrivateIpv4(bare)) throw new Error('private host');
    return;
  }
  if (bare.includes(':')) {
    if (isPrivateAddress(bare, 6)) throw new Error('private host');
    return;
  }
  const records = await lookup(bare, { all: true });
  if (records.length === 0) throw new Error('unresolvable host');
  for (const r of records) {
    if (isPrivateAddress(r.address, r.family)) throw new Error('private host');
  }
}

/* ------------------------------------------------------------------ */
/* Bounded fetching                                                   */
/* ------------------------------------------------------------------ */

async function readBody(response, maxBytes) {
  const reader = response.body?.getReader?.();
  if (!reader) return (await response.text()).slice(0, maxBytes);
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    chunks.push(value);
    if (total >= maxBytes) {
      reader.cancel().catch(() => {});
      break;
    }
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8').slice(0, maxBytes);
}

/** Fetch with a timeout, a body cap, and a manual redirect loop that
 *  re-checks every hop against the private-address guard. */
async function fetchPublic(url, { timeoutMs, maxBytes = MAX_BODY_BYTES } = {}) {
  let current = url instanceof URL ? url : new URL(url);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicHost(current.hostname);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(current, {
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; ModernBizOpsScan/1.0; +https://modernbizops.com/scorecard)',
          accept: 'text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
        },
      });
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get('location');
        if (!location || hop === MAX_REDIRECTS) throw new Error(`redirect limit at ${res.status}`);
        current = new URL(location, current);
        continue;
      }
      if (!res.ok) throw new Error(`status ${res.status}`);
      const body = await readBody(res, maxBytes);
      return { body, finalUrl: current };
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error('redirect loop');
}

/* ------------------------------------------------------------------ */
/* Signal 1 + 3: analytics, pixels, and schema from page source       */
/* ------------------------------------------------------------------ */

function matchAny(html, patterns) {
  return patterns.some((p) => p.test(html));
}

function collectJsonLdTypes(html) {
  const types = new Set();
  const blocks = html.matchAll(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const m of blocks) {
    try {
      const parsed = JSON.parse(m[1]);
      const nodes = [];
      const push = (node) => {
        if (!node || typeof node !== 'object') return;
        nodes.push(node);
        if (Array.isArray(node['@graph'])) node['@graph'].forEach(push);
      };
      (Array.isArray(parsed) ? parsed : [parsed]).forEach(push);
      for (const node of nodes) {
        const t = node['@type'];
        if (typeof t === 'string') types.add(t);
        else if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && types.add(x));
      }
    } catch {
      // Malformed JSON-LD is itself a real-world state; skip the block.
    }
  }
  for (const m of html.matchAll(/itemtype\s*=\s*["']https?:\/\/schema\.org\/([A-Za-z]+)["']/gi)) {
    types.add(m[1]);
  }
  return [...types];
}

function readPageSignals(html) {
  return {
    analytics: {
      checked: true,
      ga4: matchAny(html, GA4_PATTERNS),
      gtm: matchAny(html, GTM_PATTERNS),
    },
    adPixels: {
      checked: true,
      names: AD_PIXEL_SIGNATURES.filter((sig) => matchAny(html, sig.patterns)).map((sig) => sig.name),
    },
    social: {
      checked: true,
      platforms: SOCIAL_PLATFORMS.filter((p) => p.pattern.test(html)).map((p) => p.name),
    },
    schema: {
      checked: true,
      types: collectJsonLdTypes(html).slice(0, 12),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Signal 2: email sending infrastructure from public DNS             */
/* ------------------------------------------------------------------ */

/**
 * A TXT lookup that keeps "definitively absent" distinct from "we could not
 * ask". NXDOMAIN/NODATA is a real DNS answer (there is no record); a timeout
 * or server failure is not, and reporting it as absence would break the
 * never-report-absence-of-evidence rule.
 */
async function txtRecords(name) {
  try {
    const rows = await resolveTxt(name);
    return { ok: true, records: rows.map((chunks) => chunks.join('')) };
  } catch (err) {
    if (err?.code === 'ENOTFOUND' || err?.code === 'ENODATA') {
      return { ok: true, records: [] };
    }
    return { ok: false, records: [] };
  }
}

/** Candidate registrable domains for a hostname, cheapest heuristic that
 *  works for the ICP: strip www., then fall back to the last two labels. */
function domainCandidates(hostname) {
  const stripped = hostname.replace(/^www\./i, '');
  const labels = stripped.split('.');
  const candidates = [stripped];
  if (labels.length > 2) candidates.push(labels.slice(-2).join('.'));
  return candidates;
}

async function readEmailAuth(hostname) {
  const candidates = domainCandidates(hostname);
  for (let i = 0; i < candidates.length; i++) {
    const domain = candidates[i];
    const [apex, dmarcTxt] = await Promise.all([
      txtRecords(domain),
      txtRecords(`_dmarc.${domain}`),
    ]);
    // If either lookup FAILED (as opposed to answering "no records"), we
    // cannot speak definitively about this domain, and SPF/DMARC copy is
    // only ever definitive. Report nothing.
    if (!apex.ok || !dmarcTxt.ok) return { checked: false };
    const spf = apex.records.some((r) => /^v=spf1\b/i.test(r.trim()));
    const dmarc = dmarcTxt.records.some((r) => /^v=dmarc1\b/i.test(r.trim()));
    // A bare www host with no TXT presence at all usually means the site sits
    // on a subdomain and mail identity lives at the registrable parent; try it.
    if (!spf && !dmarc && apex.records.length === 0 && i < candidates.length - 1) {
      continue;
    }
    let dkim = null;
    if (spf || dmarc) {
      const probes = await Promise.all(
        DKIM_SELECTORS.map((sel) => txtRecords(`${sel}._domainkey.${domain}`))
      );
      const hit = probes.some((p) => p.ok && p.records.some((r) => /v=dkim1|k=rsa|p=[a-z0-9+/]/i.test(r)));
      dkim = hit ? true : null; // never false: absence of evidence is not a missing record
    }
    const missing = [];
    if (!spf) missing.push('no SPF record');
    if (!dmarc) missing.push('no DMARC record');
    return { checked: true, domain, spf, dmarc, dkim, missing };
  }
  return { checked: false };
}

/* ------------------------------------------------------------------ */
/* Signal 4: content freshness from sitemap or feed dates             */
/* ------------------------------------------------------------------ */

function latestDate(dates) {
  const parsed = dates
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()) && d.getTime() < Date.now() + 86_400_000);
  if (parsed.length === 0) return null;
  return parsed.reduce((a, b) => (a > b ? a : b));
}

async function readFreshness(pageUrl, html) {
  try {
    const { body } = await fetchPublic(new URL('/sitemap.xml', pageUrl.origin), {
      timeoutMs: AUX_TIMEOUT_MS,
      maxBytes: 400_000,
    });
    const lastmods = [...body.matchAll(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/gi)].map((m) => m[1]);
    const latest = latestDate(lastmods);
    if (latest) {
      return { checked: true, lastPublished: latest.toISOString().slice(0, 10), source: 'sitemap' };
    }
  } catch {
    // fall through to the feed
  }
  try {
    const feedHref = html?.match(/<link[^>]+type\s*=\s*["']application\/(?:rss|atom)\+xml["'][^>]*href\s*=\s*["']([^"']+)["']/i)?.[1];
    if (feedHref) {
      const { body } = await fetchPublic(new URL(feedHref, pageUrl), {
        timeoutMs: AUX_TIMEOUT_MS,
        maxBytes: 300_000,
      });
      const dates = [
        ...[...body.matchAll(/<pubDate>\s*([^<]+?)\s*<\/pubDate>/gi)].map((m) => m[1]),
        ...[...body.matchAll(/<updated>\s*([^<]+?)\s*<\/updated>/gi)].map((m) => m[1]),
      ];
      const latest = latestDate(dates);
      if (latest) {
        return { checked: true, lastPublished: latest.toISOString().slice(0, 10), source: 'feed' };
      }
    }
  } catch {
    // graceful absence
  }
  return { checked: false, lastPublished: null, source: null };
}

/* ------------------------------------------------------------------ */
/* The observed pass                                                  */
/* ------------------------------------------------------------------ */

/**
 * Read the four observed signals for a visitor-supplied website URL.
 * Always resolves within roughly OBSERVED_BUDGET_MS; never throws.
 * Returns null for a missing or unusable URL (the result simply renders
 * without an observed block), otherwise:
 *
 *   { url, host, status: 'ok'|'partial'|'unreachable',
 *     analytics, schema, emailAuth, freshness }
 */
export async function observeWebsite(input) {
  const url = normalizeWebsiteUrl(input);
  if (!url) return null;

  // Signals land in this shared object as each sub-read finishes, so the
  // budget expiring keeps whatever already completed instead of discarding it.
  const out = {
    url: url.href,
    host: url.hostname,
    status: 'unreachable',
    pageRead: false,
    analytics: { checked: false },
    adPixels: { checked: false },
    social: { checked: false },
    schema: { checked: false },
    emailAuth: { checked: false },
    freshness: { checked: false, lastPublished: null, source: null },
  };

  // Gate the WHOLE pass on the host being public, not just the page fetch: a
  // private or unresolvable host should produce no observed signals at all,
  // rather than a result carrying DNS findings about an internal name.
  try {
    await assertPublicHost(url.hostname);
  } catch {
    return out;
  }

  const pageWork = (async () => {
    const page = await fetchPublic(url, { timeoutMs: PAGE_TIMEOUT_MS });
    const signals = readPageSignals(page.body);
    out.analytics = signals.analytics;
    out.adPixels = signals.adPixels;
    out.social = signals.social;
    out.schema = signals.schema;
    out.pageRead = true;
    out.freshness = await readFreshness(page.finalUrl, page.body);
  })().catch(() => {});

  const dnsWork = (async () => {
    out.emailAuth = await readEmailAuth(url.hostname);
  })().catch(() => {});

  const budget = new Promise((resolve) => setTimeout(resolve, OBSERVED_BUDGET_MS));
  await Promise.race([Promise.all([pageWork, dnsWork]), budget]);

  const anyChecked =
    out.analytics.checked || out.emailAuth.checked || out.freshness.checked || out.schema.checked;
  out.status = out.pageRead ? 'ok' : anyChecked ? 'partial' : 'unreachable';
  return out;
}

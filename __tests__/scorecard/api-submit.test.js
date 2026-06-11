import { describe, it, expect, vi, beforeEach } from 'vitest';

const hubspotMock = {
  assertHubSpotConfigured: vi.fn(),
  ensureCustomContactProperties: vi.fn(async () => {}),
  upsertContactByEmail: vi.fn(async () => ({ id: 'contact-123', action: 'created' })),
  pickUtmProperties: vi.fn((utms) => utms || {}),
  findExistingRevopsDealForContact: vi.fn(async () => null),
  createContactTask: vi.fn(async () => 'task-1'),
  hsHeaders: vi.fn(() => ({ 'Content-Type': 'application/json' })),
  HUBSPOT_BASE: 'https://api.hubapi.test',
  REVOPS_PIPELINE_ID: '2172760768',
  NEW_LEAD_STAGE: '3477396169',
  BRADLEY_OWNER_ID: '85826069',
  UTM_CUSTOM_PROPERTIES: [],
};

vi.mock('@/lib/hubspot', () => hubspotMock);

let dealCreateBody = null;

beforeEach(() => {
  for (const fn of Object.values(hubspotMock)) {
    if (typeof fn === 'function' && fn.mockClear) fn.mockClear();
  }
  hubspotMock.findExistingRevopsDealForContact.mockResolvedValue(null);
  hubspotMock.upsertContactByEmail.mockResolvedValue({ id: 'contact-123', action: 'created' });
  dealCreateBody = null;
  global.fetch = vi.fn(async (url, opts) => {
    if (typeof url === 'string' && url.endsWith('/crm/v3/objects/deals')) {
      dealCreateBody = JSON.parse(opts.body);
      return { ok: true, json: async () => ({ id: 'deal-456' }) };
    }
    return { ok: true, json: async () => ({}) };
  });
});

async function callRoute(body) {
  const { POST } = await import('@/app/api/scorecard/submit/route');
  const req = new Request('http://test.local/api/scorecard/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(req);
}

function fixtureBody() {
  return {
    firstName: 'Jane',
    email: 'jane@example.com',
    company: 'Acme',
    utms: { utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'maturity-scorecard' },
    answers: {
      q1: { value: '7m_15m' },
      q2: { value: 'PROFESSIONAL_SERVICES' },
      q3: { value: '51_75' },
      q4: { value: 'A', score: 1 }, q5: { value: 'B', score: 2 }, q6: { value: 'A', score: 1 },
      q7: { value: 'B', score: 2 }, q8: { value: 'B', score: 2 }, q9: { value: 'B', score: 2 },
      q10: { value: 'B', score: 2 }, q11: { value: 'A', score: 1 }, q12: { value: 'A', score: 1 },
      q13: { value: '25k_100k' }, q14: { value: 'over_180' }, q15: { value: 'over_30' },
    },
  };
}

describe('POST /api/scorecard/submit', () => {
  it('upserts contact, forwards UTMs, creates deal at NEW_LEAD_STAGE in RevOps pipeline', async () => {
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBe('contact-123');
    expect(json.dealId).toBe('deal-456');
    expect(json.result).toBeDefined();
    expect(json.result.placement.stage).toBe(1);

    expect(hubspotMock.upsertContactByEmail).toHaveBeenCalledWith(
      'jane@example.com',
      expect.objectContaining({
        firstname: 'Jane',
        company: 'Acme',
        utm_source: 'linkedin',
        utm_medium: 'social',
        utm_campaign: 'maturity-scorecard',
      }),
    );
    expect(dealCreateBody.properties.pipeline).toBe('2172760768');
    expect(dealCreateBody.properties.dealstage).toBe('3477396169');
    expect(dealCreateBody.properties.dealname).toMatch(/^Maturity Scorecard - Jane$/);
    expect(dealCreateBody.properties.dealname).not.toMatch(/—/);
  });

  it('is idempotent: returns existing deal id when one is already in the pipeline', async () => {
    hubspotMock.findExistingRevopsDealForContact.mockResolvedValue('existing-deal-999');
    const res = await callRoute(fixtureBody());
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.dealId).toBe('existing-deal-999');
    expect(dealCreateBody).toBeNull();
  });

  it('rejects missing email', async () => {
    const body = fixtureBody();
    delete body.email;
    const res = await callRoute(body);
    expect(res.status).toBe(400);
  });

  it('rejects malformed answers', async () => {
    const body = fixtureBody();
    body.answers = {};
    const res = await callRoute(body);
    expect(res.status).toBe(400);
  });
});

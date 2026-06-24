import { describe, it, expect, vi, beforeEach } from 'vitest';

const hubspotMock = {
  UTM_CUSTOM_PROPERTIES: [],
  pickUtmProperties: vi.fn((u) => u || {}),
  ensureCustomContactProperties: vi.fn(async () => {}),
  markContactForReview: vi.fn(async () => true),
};

vi.mock('@/lib/hubspot', () => hubspotMock);

let contactCreateBody = null;
let dealCalled = false;

beforeEach(() => {
  vi.resetModules();
  process.env.HUBSPOT_API_KEY = 'test-token';
  for (const fn of Object.values(hubspotMock)) {
    if (typeof fn === 'function' && fn.mockClear) fn.mockClear();
  }
  contactCreateBody = null;
  dealCalled = false;
  global.fetch = vi.fn(async (url, opts) => {
    if (typeof url === 'string' && url.includes('/crm/v3/objects/deals')) {
      dealCalled = true;
      return { ok: true, json: async () => ({ id: 'deal-x' }) };
    }
    if (typeof url === 'string' && url.includes('/crm/v3/objects/contacts/search')) {
      return { ok: true, json: async () => ({ total: 0 }) };
    }
    if (typeof url === 'string' && url.endsWith('/crm/v3/objects/contacts')) {
      contactCreateBody = JSON.parse(opts.body);
      return { ok: true, json: async () => ({ id: 'contact-1' }) };
    }
    // property existence checks and anything else
    return { ok: true, status: 200, json: async () => ({}) };
  });
});

async function callRoute(body) {
  const { POST } = await import('@/app/api/submit-form/route');
  const req = new Request('http://test.local/api/submit-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(req);
}

function fixtureBody() {
  return {
    firstName: 'Dana',
    lastName: 'Lopez',
    email: 'dana@company.com',
    phone: '555-0100',
    revenue: '$5M–$15M',
    teamSize: '6–15',
    bottleneck: 'Leads stall in handoff.',
    previousConsultant: 'no',
    previousConsultantDetails: '',
    utms: { utm_source: 'linkedin' },
  };
}

describe('POST /api/submit-form (/book path)', () => {
  it('upserts the contact with qualifying props, marks for review, creates NO deal', async () => {
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBe('contact-1');
    expect(json.dealId).toBeUndefined();

    expect(contactCreateBody).not.toBeNull();
    expect(contactCreateBody.properties).toEqual(
      expect.objectContaining({
        company_annual_revenue: '5m_15m',
        sales_marketing_team_size: '6_15',
        growth_bottleneck: 'Leads stall in handoff.',
        previous_consultant: 'no',
        email: 'dana@company.com',
        phone: '555-0100',
        utm_source: 'linkedin',
      })
    );
    expect(hubspotMock.markContactForReview).toHaveBeenCalledWith('contact-1');
    expect(dealCalled).toBe(false);
  });

  it('returns 500 when HUBSPOT_API_KEY is not set', async () => {
    delete process.env.HUBSPOT_API_KEY;
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(500);
  });
});

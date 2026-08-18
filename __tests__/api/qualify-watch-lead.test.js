import { describe, it, expect, vi, beforeEach } from 'vitest';

const hubspotMock = {
  assertHubSpotConfigured: vi.fn(),
  ensureCustomContactProperties: vi.fn(async () => {}),
  findContactByEmail: vi.fn(async () => 'contact-42'),
  markContactForReview: vi.fn(async () => true),
  hsHeaders: vi.fn(() => ({ 'Content-Type': 'application/json' })),
  HUBSPOT_BASE: 'https://api.hubapi.com',
};

vi.mock('@/lib/hubspot', () => hubspotMock);

let contactPatchBody = null;
let dealCalled = false;

beforeEach(() => {
  for (const fn of Object.values(hubspotMock)) {
    if (typeof fn === 'function' && fn.mockClear) fn.mockClear();
  }
  hubspotMock.findContactByEmail.mockResolvedValue('contact-42');
  contactPatchBody = null;
  dealCalled = false;
  global.fetch = vi.fn(async (url, opts) => {
    if (typeof url === 'string' && url.includes('/crm/v3/objects/contacts/')) {
      contactPatchBody = JSON.parse(opts.body);
      return { ok: true, json: async () => ({}) };
    }
    if (typeof url === 'string' && url.includes('/crm/v3/objects/deals')) {
      dealCalled = true;
      return { ok: true, json: async () => ({ results: [], id: 'deal-x' }) };
    }
    return { ok: true, json: async () => ({}) };
  });
});

async function callRoute(body) {
  const { POST } = await import('@/app/api/qualify-watch-lead/route');
  const req = new Request('http://test.local/api/qualify-watch-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(req);
}

function fixtureBody() {
  return {
    email: 'marcus@co.com',
    firstName: 'Marcus',
    lastName: 'Chen',
    phone: '555-1234',
    revenue: '$5M–$15M',
    teamSize: '6–15',
    bottleneck: 'Pipeline stalls at proposal stage.',
    previousConsultant: 'yes',
    previousConsultantDetails: 'Big 4, not a fit.',
  };
}

describe('POST /api/qualify-watch-lead', () => {
  it('writes the full qualifying property set and creates no deal', async () => {
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.contactId).toBe('contact-42');

    expect(contactPatchBody).not.toBeNull();
    expect(contactPatchBody.properties).toEqual(
      expect.objectContaining({
        company_annual_revenue: '5m_15m',
        sales_marketing_team_size: '6_15',
        growth_bottleneck: 'Pipeline stalls at proposal stage.',
        previous_consultant: 'yes',
        previous_consultant_details: 'Big 4, not a fit.',
        firstname: 'Marcus',
        lastname: 'Chen',
        phone: '555-1234',
      })
    );
    expect(hubspotMock.markContactForReview).toHaveBeenCalledWith('contact-42');
    expect(dealCalled).toBe(false);
  });

  it('still resolves legacy revenue labels from in-flight submissions', async () => {
    const res = await callRoute({ ...fixtureBody(), revenue: '$15M–50M' });
    expect(res.status).toBe(200);
    expect(contactPatchBody.properties.company_annual_revenue).toBe('15m_50m');
  });

  it('rejects missing email', async () => {
    const res = await callRoute({ revenue: '$5M–$15M' });
    expect(res.status).toBe(400);
  });

  it('returns 404 when the contact is not found', async () => {
    hubspotMock.findContactByEmail.mockResolvedValue(null);
    const res = await callRoute(fixtureBody());
    expect(res.status).toBe(404);
  });
});
